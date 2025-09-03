import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState } from "react";

export default function CustomAccordion({
  title,
  content,
  actions,
  onChange,
  noBorder,
  noShadow,
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Accordion
      className="w-full"
      onChange={(_, isExpanded) => {
        setExpanded(isExpanded);
        if (onChange) onChange(_, isExpanded);
      }}
      sx={{
        borderRadius: "1rem !important",
        boxShadow: noShadow ? "none" : "0 4px 8px rgba(0,0,0,0.1)",
        border: noBorder ? "none" : "1px solid #e0e0e0",
        backgroundColor: "var(--color-light)",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon sx={{ color: "var(--color-medium)" }} />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          backgroundColor: "var(--color-accent)",
          minHeight: 56,
          "&.Mui-expanded": {
            minHeight: 56,
          },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            "&.Mui-expanded": {
              margin: 0,
            },
          },
          "& .MuiTypography-root": {
            fontWeight: 600,
            color: "var(--color-dark)",
          },
        }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          {typeof title === "string" ? (
            <Typography component="span">{title}</Typography>
          ) : (
            title
          )}
        </div>

        {expanded && actions && (
          <div className="flex items-center gap-2 ml-auto mr-2">{actions}</div>
        )}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          backgroundColor: "var(--color-light)",
          borderBottomLeftRadius: "1rem !important",
          borderBottomRightRadius: "1rem !important",
          borderTop: "1px solid var(--color-medium)",
          "& .MuiTypography-root": {
            color: "var(--color-dark)",
            fontSize: "0.95rem",
          },
        }}
      >
        <div className="flex flex-col gap-2">{content}</div>
      </AccordionDetails>
    </Accordion>
  );
}
