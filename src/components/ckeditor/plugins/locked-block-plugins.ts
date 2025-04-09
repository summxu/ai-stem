import { Plugin } from 'ckeditor5';
import { LockedBlockBasePlugin } from './locked-block-base-plugin';
import { createButton } from '../utils/button-factory';

const ChecksIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1744183205826" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4102" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><path d="M448 160a32 32 0 0 1 32-32h448a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-64zM128 64a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h128a128 128 0 0 0 128-128V192a128 128 0 0 0-128-128H128z m0 512a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h128a128 128 0 0 0 128-128v-128a128 128 0 0 0-128-128H128z m54.656-233.344a32 32 0 0 1-45.312 0l-64-64a32 32 0 1 1 45.312-45.312l41.344 41.408 105.344-105.408a32 32 0 1 1 45.312 45.312l-128 128z m0 512a32 32 0 0 1-45.312 0l-64-64a32 32 0 0 1 45.312-45.312l41.344 41.408 105.344-105.408a32 32 0 0 1 45.312 45.312l-128 128zM448 672a32 32 0 0 1 32-32h448a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-64zM448 352a32 32 0 0 1 32-32h320a32 32 0 0 1 0 64h-320a32 32 0 0 1-32-32zM448 864a32 32 0 0 1 32-32h320a32 32 0 0 1 0 64h-320a32 32 0 0 1-32-32z" fill="#000000" p-id="4103"></path></svg>`;
const FileIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1744183494432" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8181" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><path d="M823.296 60.416q65.536 0 99.328 38.4t33.792 93.696l0 543.744q0 25.6-21.504 46.08l-171.008 163.84q-13.312 11.264-22.528 14.336t-23.552 3.072l-459.776 0q-23.552 0-47.104-9.728t-41.984-27.648-30.208-43.008-11.776-55.808l0-634.88q0-60.416 33.28-96.256t94.72-35.84l568.32 0zM608.256 702.464q13.312 0 22.528-9.216t9.216-22.528q0-14.336-9.216-23.04t-22.528-8.704l-320.512 0q-13.312 0-22.528 8.704t-9.216 23.04q0 13.312 9.216 22.528t22.528 9.216l320.512 0zM736.256 509.952q13.312 0 22.528-9.216t9.216-22.528-9.216-22.528-22.528-9.216l-448.512 0q-13.312 0-22.528 9.216t-9.216 22.528 9.216 22.528 22.528 9.216l448.512 0zM799.744 318.464q13.312 0 22.528-9.216t9.216-23.552q0-13.312-9.216-22.528t-22.528-9.216l-512 0q-13.312 0-22.528 9.216t-9.216 22.528q0 14.336 9.216 23.552t22.528 9.216l512 0z" p-id="8182"></path></svg>`;
const FlowIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1744183515174" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9224" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><path d="M412 124c-5.523 0-10 4.477-10 10v200c0 5.523 4.477 10 10 10h200c5.523 0 10-4.477 10-10V134c0-5.523-4.477-10-10-10H412z m200-60c38.66 0 70 31.34 70 70v200c0 38.66-31.34 70-70 70h-70v99h270c27.614 0 50 22.386 50 50v147h48c27.614 0 50 22.386 50 50v160c0 27.614-22.386 50-50 50H750c-27.614 0-50-22.386-50-50V750c0-27.614 22.386-50 50-50h52V563H542v137h50c27.614 0 50 22.386 50 50v160c0 27.614-22.386 50-50 50H432c-27.614 0-50-22.386-50-50V750c0-27.614 22.386-50 50-50h50V563H222v137h52c27.614 0 50 22.386 50 50v160c0 27.614-22.386 50-50 50H114c-27.614 0-50-22.386-50-50V750c0-27.614 22.386-50 50-50h48V553c0-27.614 22.386-50 50-50h270v-99h-70c-38.66 0-70-31.34-70-70V134c0-38.66 31.34-70 70-70h200zM264 760H124v140h140V760z m318 0H442v140h140V760z m318 0H760v140h140V760z" fill="#000000" p-id="9225"></path></svg>`;
const GapFillingIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1744183436711" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5358" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><path d="M128 170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667z m85.333333 42.666666v597.333334h597.333334V213.333333H213.333333z" fill="#000000" p-id="5359"></path><path d="M554.666667 298.666667v426.666666h-85.333334V298.666667h85.333334z" fill="#000000" p-id="5360"></path><path d="M640 362.666667H384v-85.333334h256v85.333334zM640 746.666667H384v-85.333334h256v85.333334z" fill="#000000" p-id="5361"></path></svg>`;

// 选择题锁定块插件
export class ChecksBlockPlugin extends Plugin {
    static get requires() {
        return [LockedBlockBasePlugin];
    }

    init() {
        const editor = this.editor;

        // 创建选择题按钮
        createButton(
            editor,
            'insertChecksBlock',
            '插入选择题',
            ChecksIcon,
            'insertLockedBlock',
            'choice',
        );
    }
}

// 文件锁定块插件
export class FileBlockPlugin extends Plugin {
    static get requires() {
        return [LockedBlockBasePlugin];
    }

    init() {
        const editor = this.editor;

        // 创建文件按钮
        createButton(
            editor,
            'insertFileBlock',
            '插入附件上传题',
            FileIcon,
            'insertLockedBlock',
            'file',
        );
    }
}

// 流程图锁定块插件
export class FlowBlockPlugin extends Plugin {
    static get requires() {
        return [LockedBlockBasePlugin];
    }

    init() {
        const editor = this.editor;

        // 创建流程图按钮
        createButton(
            editor,
            'insertFlowBlock',
            '插入流程排序题',
            FlowIcon,
            'insertLockedBlock',
            'flow',
        );
    }
}

// 填空题锁定块插件
export class GapFillingBlockPlugin extends Plugin {
    static get requires() {
        return [LockedBlockBasePlugin];
    }

    init() {
        const editor = this.editor;

        // 创建填空题按钮
        createButton(
            editor,
            'insertGapFillingBlock',
            '插入填空题',
            GapFillingIcon,
            'insertLockedBlock',
            'gap',
        );
    }
} 