import React from "react";
import CarouselButton from "./CarouselButton";
import CarouselSlide from "./CarouselSlide";
import PropTypes from "prop-types";

class Carousel extends React.PureComponent {
  static propTypes = {
    slides: PropTypes.arrayOf(PropTypes.shape(CarouselSlide.propTypes))
      .isRequired,
  };

  static defaultProps = {
    defaultImgHeight: CarouselSlide.defaultProps.imgHeight,
  };

  state = {
    slideIndex: 0,
  };

  handlePrev = () => {
    const { slides } = this.props;
    this.setState(({ slideIndex }) => ({
      slideIndex: (slideIndex + slides.length - 1) % slides.length,
    }));
  };

  handleNext = () => {
    const { slides } = this.props;
    this.setState(({ slideIndex }) => ({
      slideIndex: (slideIndex + 1) % slides.length,
    }));
  };

  render() {
    const { defaultImgHeight, slides, ...rest } = this.props;
    return (
      <div {...rest}>
        <CarouselSlide
          imgHeight={defaultImgHeight}
          {...slides[this.state.slideIndex]}
        />
        <CarouselButton data-action="prev" onClick={this.handlePrev}>
          Prev
        </CarouselButton>
        <CarouselButton data-action="next" onClick={this.handleNext}>
          Next
        </CarouselButton>
      </div>
    );
  }
}
export default Carousel;
