import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { onMount, onCleanup } from 'solid-js';
import { loadImage, loadImages } from '~/utils/loadImage';
import { clamp } from '~/utils/number';

const HeroScript = (props) => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        gsap.registerPlugin(ScrollTrigger);
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-bg',
                start: 'top top',
                end: 'bottom+=500px bottom',
                scrub: true,
            }
        })
        tl
            .fromTo('.home__hero-bg-main-inner', { scale: 1, xPercent: 0, yPercent: 0 }, { scale: 1.7, xPercent: 5, yPercent: -8, duration: 2, ease: 'linear' })
            .fromTo(['.home__hero-title-wrap', '.home__hero-scope-wrap', '.home__hero-intro-wrap'], { autoAlpha: 1 }, { autoAlpha: 1, stagger: .1, duration: .5, ease: 'linear' }, 0)
            .fromTo('.home__hero-bg-main-inner', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            // .fromTo(['.home__hero-clone-wrap', '.home__hero-bg-main-inner'], { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            // .fromTo('.home__intro-bg-gradient', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'linear' }, '-=1')
            .fromTo('.home__intro-companies', { yPercent: 0 }, { yPercent: window.innerWidth > 767 ? 20 : 0, duration: 1, ease: 'linear' }, "<.3")
            .to('.home__intro-bg-gradient', { display: 'none', duration: 0, ease: 'linear' });

        const vertex = `
            attribute vec2 a_position;

            void main() {
                gl_Position = vec4( a_position, 0, 1 );
            }
        `
        const fragment = `
            #ifdef GL_ES
            precision mediump float;
            #endif

            uniform vec4 resolution;
            uniform vec2 mouse;
            uniform vec2 threshold;
            uniform float time;
            uniform float pixelRatio;
            uniform sampler2D image0;
            uniform sampler2D image1;

            vec2 mirrored(vec2 v) {
                vec2 m = mod(v,2.);
                return mix(m,2.0 - m, step(1.0 ,m));
            }

            void main() {
                // uvs and textures
                vec2 uv = pixelRatio*gl_FragCoord.xy / resolution.xy ;
                vec2 vUv = (uv - vec2(.5, 1.0))*resolution.zw + vec2(0.5, 1.0);
                vUv.y = 1.0 - vUv.y;

                vec4 tex1 = texture2D(image1,mirrored(vUv));
                vec2 fake3d = vec2(vUv.x + (tex1.r - 0.5)*mouse.x/threshold.x, vUv.y + (tex1.r - 0.5)*mouse.y/threshold.y);

                gl_FragColor = texture2D(image0, mirrored(fake3d));
            }
        `;

        const gn = new GyroNorm();

        // gn.FULLTILT = FULLTILT;
        class Sketch {
            constructor(parent) {
                this.container = document.getElementById(parent);
                this.canvas = document.createElement('canvas');
                this.container.appendChild(this.canvas);
                this.gl = this.canvas.getContext('webgl');
                this.ratio = window.devicePixelRatio;
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
                this.mouseX = 0;
                this.mouseY = 0;

                this.mouseTargetX = 0;
                this.mouseTargetY = 0;

                this.imageOriginal = this.container.getAttribute('data-imageOriginal');
                this.imageDepth = this.container.getAttribute('data-imageDepth');
                this.vth = this.container.getAttribute('data-verticalThreshold');
                this.hth = this.container.getAttribute('data-horizontalThreshold');

                this.imageURLs = [
                this.imageOriginal,
                this.imageDepth
                ];
                this.textures = [];

                this.startTime = new Date().getTime(); // Get start time for animating

                this.createScene();
                this.addTexture();
                this.mouseMove();
                // this.gyro();
            }

            addShader( source, type ) {
                let shader = this.gl.createShader( type );
                this.gl.shaderSource( shader, source );
                this.gl.compileShader( shader );
                let isCompiled = this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS );
                if ( !isCompiled ) {
                    throw new Error( 'Shader compile error: ' + this.gl.getShaderInfoLog( shader ) );
                }
                this.gl.attachShader( this.program, shader );
            }

            resizeHandler() {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
                this.width = this.container.offsetWidth;
                this.height = this.container.offsetHeight;

                this.canvas.width = this.width*this.ratio;
                this.canvas.height = this.height*this.ratio;
                this.canvas.style.width = this.width + 'px';
                this.canvas.style.height = this.height + 'px';
                let a1,a2;
                if(this.height/this.width<this.imageAspect) {
                    a1 = 1;
                    a2 = (this.height/this.width) / this.imageAspect;
                } else{
                    a1 = (this.width/this.height) * this.imageAspect;
                    a2 = 1;
                }

                this.uResolution.set( this.width, this.height, a1, a2 );
                this.uRatio.set( 1/this.ratio );
                this.uThreshold.set( this.hth, this.vth );
                this.gl.viewport( 0, 0, this.width*this.ratio, this.height*this.ratio );
            }

            resize() {
                this.resizeHandler();
                window.addEventListener( 'resize', this.resizeHandler.bind(this) );
            }

            createScene() {

                this.program = this.gl.createProgram();

                this.addShader( vertex, this.gl.VERTEX_SHADER );
                this.addShader( fragment, this.gl.FRAGMENT_SHADER );

                this.gl.linkProgram( this.program );
                this.gl.useProgram( this.program );


                this.uResolution = new Uniform( 'resolution', '4f' , this.program, this.gl );
                this.uMouse = new Uniform( 'mouse', '2f' , this.program, this.gl );
                this.uTime = new Uniform( 'time', '1f' , this.program, this.gl );
                this.uRatio = new Uniform( 'pixelRatio', '1f' , this.program, this.gl );
                this.uThreshold = new Uniform( 'threshold', '2f' , this.program, this.gl );
                // create position attrib
                this.billboard = new Rect( this.gl );
                this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');

                this.gl.enableVertexAttribArray( this.positionLocation );
                this.gl.vertexAttribPointer( this.positionLocation, 2, this.gl.FLOAT, false, 0, 0 );
            }

            addTexture() {
                let that = this;
                let gl = that.gl;
                loadImages(this.imageURLs, that.start.bind(this));
            }

            start(images) {
                let that = this;
                let gl = that.gl;


                this.imageAspect = images[0].naturalHeight/images[0].naturalWidth;
                for (var i = 0; i < images.length; i++) {
                    let texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    // Set the parameters so we can render any size image.
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    // Upload the image into the texture.
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
                    this.textures.push(texture);
                }

                // lookup the sampler locations.
                let u_image0Location = this.gl.getUniformLocation(this.program, 'image0');
                let u_image1Location = this.gl.getUniformLocation(this.program, 'image1');

              // set which texture units to render with.
                this.gl.uniform1i(u_image0Location, 0); // texture unit 0
                this.gl.uniform1i(u_image1Location, 1); // texture unit 1

                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
                this.gl.activeTexture(this.gl.TEXTURE1);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1]);


                // start application
                this.resize();
                this.render();
            }

            gyro() {
                let that = this;

                this.maxTilt = 15;


                const rotationCoef = 0.15;

                gn.init({ gravityNormalized: true }).then(function() {
                gn.start(function(data) {

                    let y = data.do.gamma;
                    let x = data.do.beta;

                    that.mouseTargetY = clamp(x,-that.maxTilt, that.maxTilt)/that.maxTilt;
                    that.mouseTargetX = -clamp(y,-that.maxTilt, that.maxTilt)/that.maxTilt;

                });
                }).catch(function(e) {
                    // console.log('not supported');
                });
            }
            mouseMove() {
                let that = this;
                document.addEventListener('mousemove', function(e) {
                let halfX = that.windowWidth/2;
                let halfY = that.windowHeight/2;
                    that.mouseTargetX = (halfX - e.clientX)/halfX;
                    that.mouseTargetY = (halfY - e.clientY)/halfY;
                });
            }

            render() {
                let now = new Date().getTime();
                let currentTime = ( now - this.startTime ) / 1000;
                this.uTime.set( currentTime );
                // inertia
                this.mouseX += (this.mouseTargetX - this.mouseX)*0.05;
                this.mouseY += (this.mouseTargetY - this.mouseY)*0.05;


                this.uMouse.set( this.mouseX, this.mouseY );

                // render
                this.billboard.render( this.gl );
                requestAnimationFrame( this.render.bind(this) );
            }
        }
        function Uniform( name, suffix, program,gl ) {
            this.name = name;
            this.suffix = suffix;
            this.gl = gl;
            this.program = program;
            this.location = gl.getUniformLocation( program, name );
        }

        Uniform.prototype.set = function( ...values ) {
            let method = 'uniform' + this.suffix;
            let args = [ this.location ].concat( values );
            this.gl[ method ].apply( this.gl, args );
        };

        function Rect( gl ) {
            var buffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
            gl.bufferData( gl.ARRAY_BUFFER, Rect.verts, gl.STATIC_DRAW );
        }
        Rect.verts = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1,
        ]);

        Rect.prototype.render = function( gl ) {
            gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
        };

        new Sketch('hero-bg')
        onCleanup(() => tl.kill());
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;