import json
import boto3
import StringIO
import zipfile
#from botocore.client import Config
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:us-east-1:481887095455:PortfolioDeployTopic')
    
    location = {
        "bucketName":'portfoliobuild.thomashradek.com',
        "objectKey": 'portfoliobuild.zip'
    }
    
    try:
        job = event.get("CodePipeline.job")
        print "Job: " + str(job)
        if job:
            for artifact in job["data"]["inputArtifacts"]:
                if artifact["name"] == "portfolioBuilt":
                    location = artifact["location"]["s3Location"]
                    
        print "Building portfolio from: " + str(location)        
        s3 = boto3.resource('s3')#, config=Config(signature_version='s3v4'))
        build_bucket = s3.Bucket(location['bucketName'])
        portfolio_bucket = s3.Bucket('portfolio.thomashradek.com')
        portfolio_zip = StringIO.StringIO()
        
        build_bucket.download_fileobj(location["objectKey"], portfolio_zip)
        
        with zipfile.ZipFile(portfolio_zip) as myzip:
            for nm in myzip.namelist():
                obj = myzip.open(nm)
                portfolio_bucket.upload_fileobj(obj, nm, ExtraArgs={'ContentType': mimetypes.guess_type(nm)[0]})
                portfolio_bucket.Object(nm).Acl().put(ACL='public-read')
                
	extra = 'Not from Pipeline: '
        if job:
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_success_result(jobId=job["id"])
            extra = 'From pipeline: '

        topic.publish(Subject="Portfolio Deployed", Message="Portfolio Deployed successfully" + extra + str(location))

        return {
            'statusCode': 200,
            'body': json.dumps('Completed not from pipeline')
        }

    except:
        topic.publish(Subject="Portfolio Deployed", Message="Portfolio NOT Deployed successfully")
        raise
