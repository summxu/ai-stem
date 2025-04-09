import { LockedBlockBasePlugin } from './locked-block-base-plugin';
import { 
    ChecksBlockPlugin, 
    FileBlockPlugin, 
    FlowBlockPlugin, 
    GapFillingBlockPlugin 
} from './locked-block-plugins';

export {
    LockedBlockBasePlugin,
    ChecksBlockPlugin,
    FileBlockPlugin,
    FlowBlockPlugin,
    GapFillingBlockPlugin
};

// 导出旧的插件名称，用于兼容性
export const LockedBlockPlugin = LockedBlockBasePlugin; 