(function () {
    "use strict";
    //carousel
    const carousels = document.querySelectorAll(".carousel-container");
    const direction_attribute = "data-direction";
    const slide_class = ".slide";
    const indicator_type = "span";
    if (carousels) {
        const update_indicator = function (carousel, slide_id) {
            const indicator_list = carousel.querySelectorAll(".indicator " + indicator_type);
            const selected_indicator = carousel.querySelector(".indicator .selected");
            if (indicator_list && selected_indicator) {
                selected_indicator.classList.remove("selected");
                indicator_list[slide_id].classList.add("selected");
            }
        };
        Object.keys(carousels).forEach(function (carousel_index) {
            const this_carousel = carousels[carousel_index];
            if (this_carousel) {
                const carousel_buttons = this_carousel.querySelectorAll("button");
                const c_container = this_carousel.querySelector(".carousel");
                if (c_container) {
                    const c_slides = c_container.querySelectorAll(slide_class);
                    
                    //set slide length css variable
                    c_container.style.setProperty("--slide_number", c_slides.length);

                    if (carousel_buttons && c_slides) {
                        Object.keys(carousel_buttons).forEach(function (index) {
                            carousel_buttons[index].onclick = function (e) {

                                //direction slide
                                const dir = e.target.getAttribute(direction_attribute) === "next" || false;

                                //current container offset
                                const offset = c_container.scrollLeft;

                                //move to offset
                                let move_to_offset = 0;
                                let selected_index = 0;
                                let is_set = false;

                                //return next/prevous slide scroll offset
                                Object.keys(c_slides).forEach(function (index) {
                                    if (dir) {
                                        if (c_slides[index].offsetLeft > offset && !is_set) {
                                            move_to_offset = c_slides[index].offsetLeft;
                                            selected_index = index;
                                            is_set = true;
                                        }
                                    } else {
                                        if (c_slides[index].offsetLeft < offset && !is_set) {
                                            move_to_offset = c_slides[index].offsetLeft;
                                            selected_index = index;
                                        }
                                    }
                                });

                                //is previous and offset is 0
                                if (!dir && offset === 0) {
                                    move_to_offset = c_slides[c_slides.length - 1].offsetLeft;
                                    selected_index = c_slides.length - 1;
                                }

                                //scroll to slide
                                if (c_container.scrollTo) {
                                    c_container.scrollTo({
                                        top: 0,
                                        left: move_to_offset,
                                        behavior: "smooth"
                                    });
                                } else {
                                    c_container.scrollLeft = move_to_offset;
                                }

                                //update indicator
                                update_indicator(this_carousel, selected_index);
                            };
                        });
                    }

                    //on y scroll
                    if (c_slides) {
                        let is_scrolling = null;
                        c_container.onscroll = function (e) {

                            //scroll finished time out
                            window.clearTimeout(is_scrolling);
                            is_scrolling = setTimeout(function () {
                                const left_pos = e.target.scrollLeft + 1;
                                Object.keys(c_slides).some(function (index) {
                                    if (c_slides[index].offsetLeft < left_pos) {
                                        update_indicator(this_carousel, index);
                                        return;
                                    }
                                });
                            }, 66);
                        };
                    }
                }
            }
        });
    }

}());
