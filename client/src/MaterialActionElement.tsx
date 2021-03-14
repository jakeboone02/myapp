import Button from "@material-ui/core/Button";
import { ActionProps } from "react-querybuilder";

const MaterialActionElement = ({
  className,
  handleOnClick,
  label,
  title,
}: ActionProps) => (
  <Button
    variant="contained"
    color="primary"
    className={className}
    title={title}
    size="small"
    onClick={(e) => handleOnClick(e)}
  >
    {label}
  </Button>
);

MaterialActionElement.displayName = "MaterialActionElement";

export default MaterialActionElement;
