uniform float opacity;
varying vec2 vUv;
varying vec4 shape;
uniform vec3 uColor;
		void main() {
			vec3 color =  vec3(uColor.r *vUv.x, uColor.g * vUv.y, uColor.b);
			vec3 final = color * (1.0 - shape.a);
			gl_FragColor =vec4(final*5.0,clamp(shape.a, 0.1,1.0));
		}