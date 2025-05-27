import React from 'react';
import { PaletteMode, ThemeOptions } from '@mui/material';
import { deepOrange, teal } from '@mui/material/colors';

export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
});

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        primary: mode === 'light' ? teal : deepOrange,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});
