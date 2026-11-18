import { Flame, Hammer, Ruler, Scissors, SprayCan, Wrench, ClipboardList, BadgeCheck, Factory, SearchCheck, Package, type LucideIcon } from 'lucide-react'

export interface ProcessStep {
  id: string
  label: string
  text: string
  icon: LucideIcon
  /** Optional photograph path; leave undefined until a real workshop photograph is added. */
  image?: string
}

export const workshopSteps: ProcessStep[] = [
  { id: 'cutting', label: 'Cutting', text: 'Steel sheet is cut to the sizes each cabinet needs.', icon: Scissors },
  { id: 'precision', label: 'Precision', text: 'Parts are formed and checked so doors and frames align.', icon: Ruler },
  { id: 'welding', label: 'Welding', text: 'Cabinet bodies and doors are welded into solid structures.', icon: Flame },
  { id: 'grinding', label: 'Grinding', text: 'Weld seams and edges are ground smooth before finishing.', icon: Hammer },
  { id: 'coating', label: 'Coating', text: 'Colour and surface finishes are applied in the coating shop.', icon: SprayCan },
  { id: 'assembly', label: 'Assembly', text: 'Locks, hardware and interiors are fitted and the cabinet is packed.', icon: Wrench },
]

export interface OrderStep {
  id: string
  label: string
  text: string
  icon: LucideIcon
}

export const orderSteps: OrderStep[] = [
  { id: 'requirement', label: 'Requirement', text: 'Share the model, size, material, colour, process and quantity you need.', icon: ClipboardList },
  { id: 'sample', label: 'Sample confirmation', text: 'Approve a charged sample before production begins.', icon: BadgeCheck },
  { id: 'production', label: 'Production progress', text: 'Production runs on the customization lines, with progress updates to you.', icon: Factory },
  { id: 'inspection', label: 'Inspection', text: 'Inspection and report support is available before the order leaves.', icon: SearchCheck },
  { id: 'packaging', label: 'Packaging', text: 'Packaging is included, ready for the shipping arrangement you choose.', icon: Package },
]

export const customOptions = [
  { id: 'size', title: 'Size', text: 'Adjust external or internal dimensions to suit the space or the items being stored.' },
  { id: 'material', title: 'Material', text: 'Discuss steel and finishing materials for the cabinet body and door.' },
  { id: 'colour', title: 'Colour', text: 'Choose colour and finish, including wood-grain and painted options.' },
  { id: 'process', title: 'Process', text: 'Specify surface treatment and construction process requirements.' },
  { id: 'moq', title: 'Minimum order', text: 'The minimum order quantity for custom production is 20 units.' },
]
