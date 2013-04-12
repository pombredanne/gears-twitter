define([], function(){
    return {
        "drop": {
			"mode": "dialog",
			"src": "edit.html"
		},
        "edit": {
			"mode": "palette",
			"src": "edit.html"
		},
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0QzMzdGRjU5N0UzMTFFMkI0QUFBNzVGOUQxMTJCNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0QzMzdGRjY5N0UzMTFFMkI0QUFBNzVGOUQxMTJCNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RDMzN0ZGMzk3RTMxMUUyQjRBQUE3NUY5RDExMkI1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RDMzN0ZGNDk3RTMxMUUyQjRBQUE3NUY5RDExMkI1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pqf9hjAAAAPkSURBVHjatFZNaFxVFP7u+5nMTDKZTvozMRpTFRSphuKiIFShYlFQkEJdiIFx70YoBcGiLrpxIbhVK5KV4KYLCy0UKjXVooa2tFYM2Nafzphpm0knM5l5f/dev/veTJrpmKi0PXB47937znfO/c7Pe0JrjVKpdD+AD6k7qeb+TqRMPUXdNz09XRZTU1OPCSG+48II7q7UqM84URQdpIO7DY5OwAeNg910gHsku42DfJ8D5gXrOBVKwgp8CIvvKA1l2VCpAQgZxXaazx0ZcsIwxIoDXgXBrTCgkQXtuImzFWSR7A3mUNm1Fze3PAgn8jB2dgaFczNoTTwKGUmka/MrTnocmMj8wTwqL5Qw/vWXcBfmodLZnsgVnf70+juoTG4HQi5awO9PPIcHdpxGW9nYeuQQ7CiCFtJYMCA6CIIg1rDdwtJADnPP78WFN95Dc/M4ZL2GsLUc70fNJVx5+hVUthG8rkBEoKngCxeXJp9Fa6iA5sh9CNptvp/gWjEwncQqFdRCFda1OqoPb8OP+w+hsudNBLkCVKOOkFqdeBIIEHMPqZMraTGncWdPYvD0MYRc62L25gAaqetXseGbw6i9VIIn0vj5xRJyO17G0KXzyCyUEW1iH3oqAV+VG/gSm8+cIIRCQIqSWtFwGo0GHMeBbduwyXFYnICbzcOqLUJlhxmtQiNdQGP7rphvAwQ/6i0r2gpvGbrViFmIfB9SyuQEPh+MWqwam4HIq5dxY+sk1DD7pO0lADJIaFlL7BRc2snyFSwxaqlUHD2SGkhEKXM0btQXUPjsXaD6FxeRULGe0obFAvfXC4hMQZgKWlXalnnoqsmBSmWQO3cCW74/ihSbKXZiQNZSzRibbWRPHeZJnBXuu+qYyPs6lYny6osI2BPwWB7SX5ueTBqZI58ie/4kG3CYOe7Fs/P5/Pt9RsxH6uK3kIs1aCZcDxYSNrVKOrurqSzsuTPY+PnbLJCQzWX1Q60+ju4aBh7soIXizBcY+fMiLGGbJN3iXfOZFWbPzWLTB6/BXbrB0eLidqyYotUJgWKCxh+Hv/NVBKOPIHpoEssbRkkTq8kMNjNfLPJMwMzRTzB87GOkWnUodyA53T9IrwPSoP74BcHscXhP2YhaHqzhjSyRNOu8CevmNTjXf0P6h6+QuXwWVibL2ZTqHYi353NsbKxvV5AiHXFqCjOG02TEiaeoFbFfTKSMWJuo/4OYE9R5zfd8DowxlZMdtolOhnG3wmHEELe+Gf8uTVOmHCDYs/57olM5ybz6H3Lc1NWBzgca9+Cjf0CYJBeLRfOr8lHnt2X0DoHnO78tb1Wr1fLfAgwA97c2sCR5yckAAAAASUVORK5CYII=",
        "key": "twitter",
        "lang": {
            "en-US": {
                "_description": "This Gear will create a Twitter handle.",
                "_name": "Twitter"
            },
            "es-MX": {
                "_description": "Este engranaje creará un mango del twittero.",
                "_name": "El twittero"
            }
        },
        "version": "1.0.0",
        "viewTypes": ["*"]
    };
});