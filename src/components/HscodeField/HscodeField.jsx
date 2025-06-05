import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
const DEFAULT = { code: '7113.11.5000', scope: 'US' };
export default function HscodeField({
   hscodeSettings,
   setHscodeSettings
}) {
    const { enabled, code, scope } = hscodeSettings;
      const handleToggle = e => {
    const on = e.target.checked;
    setHscodeSettings({
      enabled: on,
      // reset to default only when turning on
      code: on ? DEFAULT.code : code,
      scope: on ? DEFAULT.scope : scope
    });
  };

  return (
    <Box mb={2}>
      <FormControlLabel
        control={
          <Switch
           checked={enabled}
            onChange={handleToggle}
            color="primary"
          />
        }
        label="HS Code"
      />

      {enabled && (
        <Box mt={2}>
          <TextField
            label="Code"
            variant="standard"
            fullWidth
            value={code}
              onChange={e => setHscodeSettings({ ...hscodeSettings, code: e.target.value })}
            sx={{ mb: 2 }}
          />

          <FormControl variant="standard" fullWidth>
            <InputLabel>Scope</InputLabel>
            <Select
              value={scope}
              onChange={e => setHscodeSettings({ ...hscodeSettings, scope: e.target.value })}
              label="Scope"
            >
              <MenuItem value="US">US Only</MenuItem>
              <MenuItem value="ALL">All Countries</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
