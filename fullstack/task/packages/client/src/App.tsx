import React, { useContext } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from './theme';
import ExchangeRates from './components/ExchangeRates/ExchangeRates';

const App: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box >
      <Paper
        elevation={2}
        sx={{
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Exchange Rates</Typography>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Paper>

      <ExchangeRates />
    </Box>
  );
};

export default App;
