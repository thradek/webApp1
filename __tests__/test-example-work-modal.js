import React from 'react';
import { shallow } from 'enzyme';
import ExampleWorkModal, { ExampleWorkBubble } from '../js/example-work-modal';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });


const myWork = [
        {
                'title': "Work Example",
                'href': 'http://google.com',
                'desc': 'This is my description 1',
                'image': { 'desc': "example screenshot of a project involving code", 'src': "images/example1.png", 'comment': "" }
        },
        {
                'title': "Work Example2",
                'href': 'http://yahoo.com',
                'desc': 'This is my description 2',
                'image': { 'desc': "example screenshot of a project involving chemistry", 'src': "images/example2.png", 'comment': "" }
        },
        {
                'title': "Work Example3",
                'href': 'http://.aisreporting.com',
                'desc': 'This is my description 3',
                'image': { 'desc': "example screenshot of a project involving cats", 'src': "images/example3.png", 'comment': "Bengal cat by roberto shabs is licensed under CC BY 2.0 https://www.flickr.com/photos/37287295@N00/2540855181" }
        }
];

describe("ExampleWorkModal component", () => {

        let mockCloseModalFn = jest.fn();
	let component = shallow(<ExampleWorkModal example={myWork[1]} open={false}/>);
	let openComponent = shallow(<ExampleWorkModal example={myWork[1]} open={true} closeModal={mockCloseModalFn} />);
	let anchors = component.find("a");

	it("Shout contain a signle 'a' element", () => {

		expect(anchors.length).toEqual(1);
	});

	it("Should link to our project", () => {
		expect(anchors.prop('href')).toEqual(myWork[1].href);
	});

	it("Should have the modal class set correctly", () => {
		expect(component.find(".background--skyBlue").hasClass("modal--close")).toBe(true);
		expect(openComponent.find(".background--skyBlue").hasClass("modal--open")).toBe(true);
	});

        it("Should call the close modal handler when clicked", () => {
                openComponent.find(".modal__closeButton").simulate('click');
                expect(mockCloseModalFn).toHaveBeenCalled();
        });
});
