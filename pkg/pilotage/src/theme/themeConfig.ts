import type { ThemeConfig } from 'antd';
import { theme as antTheme } from 'antd';

const { darkAlgorithm } = antTheme;

const theme: ThemeConfig = {
    algorithm: darkAlgorithm,
    token: {
        colorPrimary: '#d54253',
    }
};

export default theme;
