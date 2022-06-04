uniform float opacity;
varying vec2 vUv;
varying vec4 shape;
uniform vec3 uColor;
uniform float uColorIntensity;
		void main() {
			vec3 color =  vec3(uColor.r *vUv.x, uColor.g * vUv.y, uColor.b);
			vec3 final = color * (0.98 - shape.a);
			gl_FragColor =vec4(final*uColorIntensity,shape.a);
			// gl_FragColor = vec4( shape.a);
		}