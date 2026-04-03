// === Phase 1: Core Primitives ===
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'

export { Input, inputVariants } from './input'
export type { InputProps } from './input'

export { Label } from './label'
export type { LabelProps } from './label'

export { Checkbox } from './checkbox'
export type { CheckboxProps } from './checkbox'

export { RadioButton } from './radio-button'
export type { RadioButtonProps } from './radio-button'

export { Switch } from './switch'
export type { SwitchProps } from './switch'

export { Textarea, textareaVariants } from './textarea'
export type { TextareaProps } from './textarea'

export { Select } from './select'
export type { SelectProps, SelectOptionProps, SelectOptionGroupProps } from './select'

export { Badge, badgeVariants } from './badge'
export type { BadgeProps } from './badge'

export { Avatar, avatarVariants, AvatarGroup } from './avatar'
export type { AvatarProps, AvatarGroupProps } from './avatar'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

export { Separator } from './separator'
export type { SeparatorProps } from './separator'

export { Skeleton, skeletonVariants } from './skeleton'
export type { SkeletonProps } from './skeleton'

export { Spinner, spinnerVariants } from './spinner'
export type { SpinnerProps } from './spinner'

export { Progress, progressVariants } from './progress'
export type { ProgressProps } from './progress'

export { Alert, alertVariants, AlertTitle, AlertDescription } from './alert'
export type { AlertProps } from './alert'

export { Kbd } from './kbd'
export type { KbdProps } from './kbd'

export { Link, linkVariants } from './link'
export type { LinkProps } from './link'

export { Image } from './image'
export type { ImageProps } from './image'

export { Chip, chipVariants } from './chips'
export type { ChipProps } from './chips'

// === Phase 2: Layout & Navigation ===
export { Tabs, TabsList, tabsListVariants, TabsTrigger, TabsContent } from './tabs'
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './tabs'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'
export type { AccordionProps, AccordionItemProps } from './accordion'

export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
export type { CollapsibleProps } from './collapsible'

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './breadcrumb'

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination'
export type { PaginationLinkProps } from './pagination'

export { BottomNav, BottomNavItem } from './bottom-nav'
export type { BottomNavProps, BottomNavItemProps } from './bottom-nav'

export { Sidenav, SidenavItem, SidenavGroup, SidenavSeparator } from './sidenav'
export type { SidenavProps, SidenavItemProps, SidenavGroupProps } from './sidenav'

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from './menubar'
export type { MenubarItemProps } from './menubar'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from './navigation-menu'

export { Header } from './header'
export type { HeaderProps } from './header'

export { Footer, FooterColumn } from './footer'
export type { FooterProps, FooterColumnProps } from './footer'

export { Item, itemVariants } from './item'
export type { ItemProps } from './item'

export { ScrollArea } from './scroll-area'
export type { ScrollAreaProps } from './scroll-area'

export { AspectRatio } from './aspect-ratio'
export type { AspectRatioProps } from './aspect-ratio'

// === Phase 3: Overlays & Feedback ===
export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog'
export type { DialogProps, DialogTriggerProps, DialogContentProps, DialogCloseProps } from './dialog'

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog'
export type { AlertDialogProps, AlertDialogTriggerProps, AlertDialogContentProps } from './alert-dialog'

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  drawerContentVariants,
} from './drawer'
export type { DrawerProps, DrawerTriggerProps, DrawerContentProps, DrawerCloseProps } from './drawer'

export { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps } from './tooltip'

export { Popover, PopoverTrigger, PopoverContent } from './popover'
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps } from './popover'

export { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'
export type { HoverCardProps, HoverCardTriggerProps, HoverCardContentProps } from './hover-card'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './context-menu'
export type { ContextMenuTriggerProps, ContextMenuContentProps, ContextMenuItemProps } from './context-menu'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from './dropdown-menu'
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
} from './dropdown-menu'

export { Toaster, ToastTitle, ToastDescription, ToastAction, ToastClose, toastVariants, useToast } from './toast'
export type { ToasterProps, ToastCloseProps } from './toast'

export { Callout, calloutVariants } from './callout'
export type { CalloutProps } from './callout'

// === Phase 4: Forms & Input ===
export { Field, FieldLabel, FieldDescription, FieldError, fieldVariants } from './field'
export type { FieldProps, FieldLabelProps, FieldErrorProps } from './field'

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField } from './form'
export type { FormProps, FormFieldProps, FormMessageProps } from './form'

export { AutoForm } from './auto-form'
export type { AutoFormProps, AutoFormFieldSchema, AutoFormFieldType, AutoFormSchema } from './auto-form'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './input-otp'
export type { InputOTPProps, InputOTPSlotProps } from './input-otp'

export { InputPhone, COUNTRIES } from './input-phone'
export type { InputPhoneProps, CountryCode } from './input-phone'

export { InputGroup, InputGroupIcon, InputGroupButton } from './input-group'
export type { InputGroupProps, InputGroupIconProps, InputGroupButtonProps } from './input-group'

export { MultiSelect } from './multi-select'
export type { MultiSelectProps, MultiSelectOption } from './multi-select'

export { SelectNative, selectNativeVariants } from './select-native'
export type { SelectNativeProps } from './select-native'

export { RadioGroup, RadioGroupItem } from './radio-button-group'
export type { RadioGroupProps, RadioGroupItemProps } from './radio-button-group'

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants } from './toggle-group'
export type { ToggleGroupProps, ToggleGroupItemProps } from './toggle-group'

// === Phase 5: Data Display ===
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './table'

export { DataTable, DataTableToolbar, DataTableHeader, DataTablePagination, DataTableColumnToggle } from './data-table'
export type { DataTableProps, DataTableColumn, SortDirection } from './data-table'

export { DataGrid, DataGridHeader, DataGridRow, DataGridCell } from './data-grid'
export type { DataGridProps, DataGridColumn } from './data-grid'

export { Empty, emptyVariants } from './empty'
export type { EmptyProps } from './empty'

export { Status, statusVariants, dotVariants } from './status'
export type { StatusProps } from './status'

export { Shimmer, shimmerVariants } from './shimmer'
export type { ShimmerProps } from './shimmer'

export { BentoGrid, BentoGridItem, bentoGridVariants } from './bento-grid'
export type { BentoGridProps, BentoGridItemProps } from './bento-grid'

export { ChartArea } from './chart-area'
export type { ChartAreaProps, ChartAreaDataPoint } from './chart-area'

export { ChartBar } from './chart-bar'
export type { ChartBarProps, ChartBarDataPoint } from './chart-bar'

export { ChartLine } from './chart-line'
export type { ChartLineProps, ChartLineSeries } from './chart-line'
