uniform float opacity;
varying vec2 vUv;
varying vec4 shape;
varying vec3 vPos;
uniform vec3 uColor;
uniform float uColorIntensity;
		void main() {
			vec3 color =  vec3(uColor.r*vPos.x,  uColor.g*vPos.y, uColor.b*vPos.z);
			float alpha = smoothstep(shape.a,0.0,0.38);
			vec3 final = color * (alpha - 0.2);
			gl_FragColor =vec4(final*uColorIntensity,alpha);
		}