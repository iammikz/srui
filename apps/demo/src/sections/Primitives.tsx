import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  FormField,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Button,
  useToast,
} from "@srui/react";

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-1 text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="surface rounded-xl bg-card p-6">{children}</div>
    </section>
  );
}

export function Primitives() {
  const { toast } = useToast();
  const [comboboxValue, setComboboxValue] = useState("react");
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("comfortable");
  const [airplane, setAirplane] = useState(false);

  return (
    <>
      <Section id="select-combobox" title="Select & Combobox" description="Radix Select and cmdk-powered Combobox.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="demo-select">Select (Radix)</Label>
            <Select defaultValue="berlin">
              <SelectTrigger id="demo-select">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="berlin">Berlin</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Asia</SelectLabel>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-combobox">Combobox (filterable)</Label>
            <Combobox
              options={[
                { value: "react", label: "React" },
                { value: "vue", label: "Vue" },
                { value: "svelte", label: "Svelte" },
                { value: "solid", label: "Solid" },
              ]}
              value={comboboxValue}
              onChange={setComboboxValue}
              placeholder="Framework…"
            />
          </div>
        </div>
      </Section>

      <Section id="tabs" title="Tabs">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-3 text-sm text-muted-foreground">
            Account settings panel.
          </TabsContent>
          <TabsContent value="password" className="mt-3 text-sm text-muted-foreground">
            Password settings panel.
          </TabsContent>
          <TabsContent value="settings" className="mt-3 text-sm text-muted-foreground">
            Other settings panel.
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="tooltip-popover" title="Tooltip & Popover">
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>I am a tooltip.</TooltipContent>
          </Tooltip>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <p className="text-sm">Non-modal — the page stays interactive.</p>
            </PopoverContent>
          </Popover>
        </div>
      </Section>

      <Section id="toast" title="Toast" description="useToast() from ToastProvider.">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => toast({ title: "Profile updated", variant: "success" })}
          >
            Success toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Upload failed",
                description: "The file was too large.",
                variant: "destructive",
              })
            }
          >
            Destructive toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Draft shared", action: { label: "Undo", onClick: () => {} } })
            }
          >
            Toast with action
          </Button>
        </div>
      </Section>

      <Section id="controls" title="Checkbox, RadioGroup & Switch">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="grid gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
              Accept terms
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked disabled /> Disabled checked
            </label>
          </div>
          <RadioGroup value={radio} onValueChange={setRadio}>
            {["default", "comfortable", "compact"].map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm capitalize">
                <RadioGroupItem value={v} /> {v}
              </label>
            ))}
          </RadioGroup>
          <div className="grid gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={airplane} onCheckedChange={setAirplane} /> Airplane mode
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch disabled /> Disabled
            </label>
          </div>
        </div>
      </Section>

      <Section id="forms" title="Textarea & FormField">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Email" htmlFor="demo-email" hint="We'll never share it.">
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Bio" htmlFor="demo-bio">
            <Textarea id="demo-bio" placeholder="A few words…" />
          </FormField>
          <FormField label="Username" htmlFor="demo-username" error="That username is taken.">
            <Input id="demo-username" invalid value="srui" readOnly />
          </FormField>
        </div>
      </Section>

      <Section id="data-display" title="Avatar, Badge & Separator">
        <div className="flex flex-wrap items-center gap-6">
          <Avatar>
            <AvatarImage src="/definitely-missing.png" alt="Jane Doe" />
            <AvatarFallback name="Jane Doe" />
          </Avatar>
          <Avatar>
            <AvatarFallback name="Ada Lovelace" />
          </Avatar>
          <Separator orientation="vertical" className="h-10" />
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </div>
      </Section>

      <Section id="accordion-collapsible" title="Accordion & Collapsible">
        <div className="grid gap-8 md:grid-cols-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="a">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes — Radix handles the ARIA wiring.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>Height animates against Radix's measured variable.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                Show details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
              Hidden until opened.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Section>
    </>
  );
}
