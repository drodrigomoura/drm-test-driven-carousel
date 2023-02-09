import React from "react";
import { mount, shallow } from "enzyme";
import Carousel, { Carousel as CoreCarousel } from "../Carousel";
import CarouselButton from "../CarouselButton";
import CarouselSlide from "../CarouselSlide";

describe("Carousel", () => {
  const slides = [
    {
      imgUrl: "https://example.com/slide1.png",
      description: "Slide 1",
      attribution: "Uno Pizzeria",
    },
    {
      imgUrl: "https://example.com/slide2.png",
      description: "Slide 2",
      attribution: "Dos Equis",
    },
    {
      imgUrl: "https://example.com/slide3.png",
      description: "Slide 3",
      attribution: "Three Amigos",
    },
  ];

  describe("component with HOC", () => {
    let mounted;

    beforeEach(() => {
      mounted = mount(<Carousel slides={slides} />);
    });

    it("passes `slides` down to the core component", () => {
      expect(mounted.find(CoreCarousel).prop("slides")).toBe(slides);
    });

    it("sets slideIndex={0} on the core component", () => {
      expect(mounted.find(CoreCarousel).prop("slideIndex")).toBe(0);
    });

    it("should allow `slideIndex` to be controlled", () => {
      const mounted = mount(<Carousel slides={slides} slideIndex={1} />);
      expect(mounted.find(CoreCarousel).prop("slideIndex")).toBe(1);

      mounted.setProps({ slideIndex: 0 });
      expect(mounted.find(CoreCarousel).prop("slideIndex")).toBe(0);
    });
  });

  describe("core component", () => {
    const slideIndexDecrement = jest.fn();
    const slideIndexIncrement = jest.fn();
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <CoreCarousel
          slides={slides}
          slideIndex={0}
          slideIndexDecrement={slideIndexDecrement}
          slideIndexIncrement={slideIndexIncrement}
        />
      );
    });

    it("should render a <div>", () => {
      expect(wrapper.type()).toBe("div");
    });

    it("should has an initial 'slideIndex' of 0", () => {
      expect(wrapper.state("slideIndex")).toBe(0);
    });

    describe("with a middle slide selected", () => {
      beforeEach(() => {
        wrapper.setState({ slideIndex: 1 });
      });

      it("should decrement 'slideIndex' when Prev is clicked", () => {
        wrapper.find('[data-action="prev"]').simulate("click");
        expect(slideIndexDecrement).toHaveBeenCalledWith(slides.length);
      });

      it("should increment 'slideIndex' when Next is clicked", () => {
        wrapper.find('[data-action="next"]').simulate("click");
        expect(slideIndexIncrement).toHaveBeenCalledWith(slides.length);
      });
    });

    describe("with the first slide selected", () => {
      it("should wrap `slideIndex` to the max value when Prev is clicked", () => {
        wrapper.find("[data-action='prev']").simulate("click");
        expect(slideIndexDecrement).toHaveBeenCalledWith(slides.length);
      });
    });

    describe("with the last slide selected", () => {
      it("should wrap `slideIndex` to the min value when Next is clicked", () => {
        wrapper.find("[data-action='next']").simulate("click");

        expect(slideIndexIncrement).toHaveBeenCalledWith(slides.length);
      });
    });

    it("should render the current slide as a CarouselSlide", () => {
      let slideProps;

      slideProps = wrapper.find(CarouselSlide).props();
      expect(slideProps).toEqual({
        ...CarouselSlide.defaultProps,
        ...slides[0],
      });

      wrapper.setProps({ slideIndex: 1 });
      slideProps = wrapper.find(CarouselSlide).props();
      expect(slideProps).toEqual({
        ...CarouselSlide.defaultProps,
        ...slides[1],
      });
    });

    it("should render a CarouselButton labeled 'prev'", () => {
      expect(
        wrapper
          .find(CarouselButton)
          .at(0)
          .prop("children")
      ).toBe("Prev");
    });

    it("should render a CarouselButton labeled 'next'", () => {
      expect(
        wrapper
          .find(CarouselButton)
          .at(1)
          .prop("children")
      ).toBe("Next");
    });

    it("decrements `slideIndex` when Prev is clicked", () => {
      wrapper.find('[data-action="prev"]').simulate("click");
      expect(slideIndexDecrement).toHaveBeenCalledWith(slides.length);
    });
    it("increments `slideIndex` when Next is clicked", () => {
      wrapper.find('[data-action="next"]').simulate("click");
      expect(slideIndexIncrement).toHaveBeenCalledWith(slides.length);
    });

    it("should pass defaultImg and defaultHeight to the CarouselSlide", () => {
      const defaultImg = () => "test";
      const defaultImgHeight = 1234;

      wrapper.setProps({ defaultImg, defaultImgHeight });
      expect(wrapper.find(CarouselSlide).prop("Img")).toBe(defaultImg);
      expect(wrapper.find(CarouselSlide).prop("imgHeight")).toBe(
        defaultImgHeight
      );
    });

    it("should allows individual slides to override Img and imgHeight", () => {
      const Img = () => "test";
      const imgHeight = 1234;
      wrapper.setProps({ slides: [{ ...slides[0], Img, imgHeight }] });
      expect(wrapper.find(CarouselSlide).prop("Img")).toBe(Img);
      expect(wrapper.find(CarouselSlide).prop("imgHeight")).toBe(imgHeight);
    });
  });
});
