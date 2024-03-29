uniform float uTime;
uniform float uScale;
uniform float uIntensity;
uniform vec2 uMouse;
// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

varying vec2 vUv;
varying vec4 shape;
varying vec3 vPos;
varying vec3 vWorldPosition;
		void main() {
			vUv = uv;
			float n = noise(1.0 + position * uScale + uTime);
			vec3 pos =  1.0 + vec3(n) * uIntensity;
			shape = vec4(vec3(n) * clamp(uIntensity, 0.0, 0.1), n);
            vPos = (position*pos)/10.0;
            vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
            vWorldPosition = vec3(-worldPosition.z, worldPosition.y, -worldPosition.x);
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position * pos, 1.0 );
		}