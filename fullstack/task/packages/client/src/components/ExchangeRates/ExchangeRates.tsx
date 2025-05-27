import React, { useState, useMemo } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useExchangeRates } from '../../hooks/useExchangeRates';

const ExchangeRates: React.FC = () => {
  const { exchangeRates, loading, error, age, refetch } = useExchangeRates();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return exchangeRates;
    const lower = search.toLowerCase();
    return exchangeRates.filter(r =>
      r.currency.toLowerCase().includes(lower) ||
      r.code.toLowerCase().includes(lower) ||
      String(r.amount).includes(lower) ||
      String(r.rate).includes(lower)
    );
  }, [exchangeRates, search]);

  // highlight matching text
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlight = (value: string | number) => {
    const str = String(value);
    if (!search) return str;
    const parts = str.split(new RegExp(`(${escapeRegExp(search)})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <Box component="span" key={i} sx={{ bgcolor: 'yellow' }}>
          {part}
        </Box>
      ) : (
        part
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={<AccessTimeIcon />}
            label={`Last fetched: ${age}`}
            variant="outlined"
          />
          <IconButton
            color="primary"
            onClick={() => refetch({ bypassCache: true })}
            aria-label="refresh rates"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        {error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography color="error">
              Error fetching exchange rates: {error.message}
            </Typography>
          </Box>
        ) : loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Currency</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell align="right"><strong>Rate</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No matching records
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell>{highlight(r.currency)}</TableCell>
                    <TableCell>{highlight(r.code)}</TableCell>
                    <TableCell align="right">{highlight(r.amount)}</TableCell>
                    <TableCell align="right">{highlight(r.rate.toFixed(4))}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default ExchangeRates;
