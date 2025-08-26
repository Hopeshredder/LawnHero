import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function AccordionExpandIcon() { // need to reduce to just one accordion, also pass in title and content
  const accordions = [
    { title: "Super Tip 1: Water Optimization Techniques", content: "Water less often for longer. Water in am when coolest. Use low flow rate irrigation especially on slopes to avoid runoff." },
    { title: "Super Tip 2: Common Issues", content: "This is some sample content for accordion 2. You can replace it with your own text." },
    { title: "Super Tip 3: Pest and Disease Identification", content: "Another accordion body example. Consistent styling keeps things clean." },
    { title: "Super Tip 4: ", content: "Last accordion with placeholder text. Styled per your theme." },
  ];

  return (
    <div className="space-y-4">
      {accordions.map((item, idx) => (
        <Accordion
          key={idx}
          sx={{
            borderRadius: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "var(--color-light)",
            "&:before": { display: "none" }, // remove default divider line
          }}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: "var(--color-medium)" }} />}
            aria-controls={`panel${idx}-content`}
            id={`panel${idx}-header`}
            sx={{
              backgroundColor: "var(--color-accent)",
              borderRadius: "1rem",
              "& .MuiTypography-root": {
                fontWeight: 600,
                color: "white",
              },
            }}
          >
            <Typography component="span">{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "var(--color-light)",
              borderTop: "1px solid var(--color-medium)",
              borderRadius: "0 0 1rem 1rem",
              "& .MuiTypography-root": {
                color: "var(--color-dark)",
                fontSize: "0.95rem",
              },
            }}
          >
            <Typography>{item.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
