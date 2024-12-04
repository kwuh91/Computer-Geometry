/**
 * Shader used for combining the multiple render passes
 * 
 * Basically we set render target screen to false for our effects passes, so they render to a texture. Then for each pixel
 * we blend the layers together.
 */

export class CompositionShader {

    static fragment = `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        uniform sampler2D overlayTexture;

        varying vec2 vUv;

        void main() {
            vec4 baseColor    = texture2D(baseTexture, vUv);
            vec4 bloomColor   = texture2D(bloomTexture, vUv);
            vec4 overlayColor = texture2D(overlayTexture, vUv);

            // Baselayer + bloomlayer + 0.2(overlay)
            gl_FragColor = ( baseColor + vec4( 1.0 ) * bloomColor );

        }
`

    static vertex = `
        varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
`
}