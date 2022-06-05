uniform float opacity;
varying vec2 vUv;
varying vec4 shape;
varying vec3 vPos;
uniform vec3 uColor;
uniform float uColorIntensity;
uniform samplerCube uEnvMap;
varying vec3 vWorldPosition;
		void main() {
			vec3 color =  vec3(0.1,  0.0, vPos.b/2.0);
			// vec3 color =  vec3(vUv.xy, uColor.b);
			float alpha = smoothstep(shape.a,0.0,0.38);
			vec4 env = textureCube(uEnvMap, vWorldPosition);

			vec3 final = mix(env.rgb*0.2,color * (alpha - 0.2), 0.6);
			gl_FragColor =vec4(final*uColorIntensity,clamp(alpha, 0.3,1.0));
		}