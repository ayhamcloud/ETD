import Fab from "@mui/material/Fab";
import { useRouter } from "next/router";

export const FabOnclick = ({
  what,
  onClick,
  where,
  style,
  disabled,
  children,
  href,
}) => {
  const router = useRouter();
  const fabStyle = {
    position: "fixed",
    bottom: "1rem",
    zIndex: "1000",
    right: "0",
    left: "0"
  };
  if (where === "right") {
    fabStyle.right = "1rem";
  }
  if (where === "left") {
    fabStyle.left = "1rem";
  }
  if (style) {
    fabStyle.bottom = style.bottom;
  }

  return (
    <Fab
      variant="extended"
      sx={fabStyle}
      aria-label={what}
      onClick={
        onClick
          ? onClick
          : () => {
            router.push(href);
          }
      }
      disabled={disabled}
      type="button"
      color="primary"
    >
      {children}
    </Fab>
  );
};
