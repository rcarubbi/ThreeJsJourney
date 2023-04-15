uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorAmplitude;
varying float vElevation;

void main() {
    float elevation = (vElevation + uColorOffset) * uColorAmplitude;

    vec3 color = mix(uDepthColor, uSurfaceColor, elevation);
    gl_FragColor = vec4(color, 1.0);
}