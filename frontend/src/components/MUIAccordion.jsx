import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function CustomAccordion({ title, content, actions, onChange }) {
  return (
    <Accordion
      className="w-full"
      onChange={onChange}
      sx={{
        borderRadius: "1rem !important",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
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
          "& .MuiTypography-root": {
            fontWeight: 600,
            color: "white",
          },
        }}
      >
        {typeof title === "string" ? (
          <Typography component="span">{title}</Typography>
        ) : (
          title // render JSX (like <input>) directly
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
        <div className="flex flex-col gap-2">
          {content}
          {actions && <div className="mt-2">{actions}</div>}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
