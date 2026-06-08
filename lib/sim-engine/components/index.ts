// Import all category files to trigger self-registration
import "./gates";
import "./plexers";
import "./arithmetic";
import "./memory";
import "./wiring";
import "./io";

// Re-export registry query functions
export {
  getComponentDef,
  getAllComponents,
  getComponentsByCategory,
} from "../component-registry";
