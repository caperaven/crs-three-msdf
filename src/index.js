// var createLayout = require('layout-bmfont-text')

import {BufferGeometry} from "/node_modules/three/src/core/BufferGeometry.js";
import {BufferAttribute} from "/node_modules/three/src/core/BufferAttribute.js";
import {SphereGeometry} from "/node_modules/three/src/geometries/SphereGeometry.js";
import {Box3} from "/node_modules/three/src/math/Box3.js";
import {createIndices} from "./quad-indices.js";

import {positions, uvs} from "./vertices.js";
import {computeSphere, computeBox} from "./utils.js";

export function createTextGeometry(opt) {
    return new TextGeometry(opt);
}

class TextGeometry {
    constructor(opt) {
        BufferGeometry.call(this);

        if (typeof opt === 'string') {
            opt = {text: opt};
        }

        this._opt = Object.assign({}, opt)

        if (opt  != null) this.update(opt);
    }

    update(opt) {
        if (typeof opt === 'string') {
            opt = {text: opt};
        }

        // use constructor defaults
        opt = Object.assign({}, this._opt, opt);

        if (!opt.font) {
            throw new TypeError('must specify a { font } in options');
        }

        this.layout = createLayout(opt);

        // get vec2 texcoords
        const flipY = opt.flipY !== false;

        // the desired BMFont data
        const font = opt.font;

        // determine texture size from font file
        const texWidth = font.common.scaleW;
        const texHeight = font.common.scaleH;

        // get visible glyphs
        const glyphs = this.layout.glyphs.filter(glyph => {
            const bitmap = glyph.data;
            return bitmap.width * bitmap.height > 0;
        })

        // provide visible glyphs for convenience
        this.visibleGlyphs = glyphs;

        // get common vertex data
        const positions = positions(glyphs);
        const uvs = uvs(glyphs, texWidth, texHeight, flipY);
        const indices = createIndices([], {
            clockwise: true,
            type: 'uint16',
            count: glyphs.length
        })

        // update vertex data
        this.setIndex(indices);
        this.setAttribute('position', new BufferAttribute(positions, 2));
        this.setAttribute('uv', new BufferAttribute(uvs, 2));

        this.removeAttribute('page');
    }

    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new SphereGeometry();
        }

        const positions = this.attributes.position.array;
        const itemSize = this.attributes.position.itemSize;
        if (!positions || !itemSize || positions.length < 2) {
            this.boundingSphere.radius = 0;
            this.boundingSphere.center.set(0, 0, 0);
            return;
        }

        computeSphere(positions, this.boundingSphere);

        if (isNaN(this.boundingSphere.radius)) {
            console.error(
                ['THREE.BufferGeometry.computeBoundingSphere(): ',
                'Computed radius is NaN. The ',
                '"position" attribute is likely to have NaN values.'].join("/n"));
        }
    }

    computeBoundingBox() {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3();
        }

        const bbox = this.boundingBox;
        const positions = this.attributes.position.array;
        const itemSize = this.attributes.position.itemSize;
        if (!positions || !itemSize || positions.length < 2) {
            bbox.makeEmpty();
            return;
        }
        computeBox(positions, bbox);
    }
}




