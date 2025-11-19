import React from 'react';
import { useTranslate } from 'react-admin';
import { Tooltip, IconButton, Box, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Component to display price explanation as a tooltip
 * Shows detailed breakdown of pricing calculation
 */
const PriceExplanationField = ({ record }) => {
  const translate = useTranslate();

  if (!record || !record.priceExplanation) {
    return null;
  }

  const { basePrice, components, totalPrice } = record.priceExplanation;

  // Build the explanation string with Hebrew translations
  const buildExplanationText = () => {
    const lines = [];
    const currency = translate('priceExplanation.currency', { _: '₪' });
    const multiplier = translate('priceExplanation.multiplier', { _: '×' });
    const equals = translate('priceExplanation.equals', { _: '=' });

    // Add base price
    lines.push(
      `${translate('priceExplanation.basePrice', { _: 'תעריף בסיס' })}: ${currency}${basePrice.toFixed(2)}`
    );

    // Add each component
    components.forEach((component) => {
      const fieldLabel = translate(`resources.att_report.fields.${component.fieldKey}`, {
        _: component.fieldKey,
      });

      if (component.isBonus) {
        // Boolean bonus field
        lines.push(`${fieldLabel}: ${currency}${component.subtotal.toFixed(2)}`);
      } else {
        // Numeric field with calculation
        let calculationParts = [
          fieldLabel,
          component.value,
          multiplier,
          `${currency}${component.multiplier.toFixed(2)}`,
        ];

        // Add factor if it exists and is not 1
        if (component.factor && component.factor !== 1) {
          calculationParts.push(multiplier, component.factor);
        }

        calculationParts.push(equals, `${currency}${component.subtotal.toFixed(2)}`);

        lines.push(calculationParts.join(' '));
      }
    });

    // Add separator and total
    lines.push('─────────────────');
    lines.push(
      `${translate('priceExplanation.total', { _: 'סה"כ' })}: ${currency}${totalPrice.toFixed(2)}`
    );

    return lines.join('\n');
  };

  const explanationText = buildExplanationText();

  return (
    <Tooltip
      title={
        <Box sx={{ whiteSpace: 'pre-line', direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="body2" component="div">
            {explanationText}
          </Typography>
        </Box>
      }
      arrow
      placement="left"
    >
      <IconButton size="small" sx={{ padding: 0.5 }}>
        <InfoIcon fontSize="small" color="primary" />
      </IconButton>
    </Tooltip>
  );
};

export default PriceExplanationField;
