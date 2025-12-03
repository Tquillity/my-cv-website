import { useTranslations } from "next-intl";
import { MotionDiv, MotionH1, MotionP } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";

export const Hero: React.FC = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="container mx-auto flex flex-col items-center text-center z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <MotionH1
            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Mikael Sundh
          </MotionH1>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground">
              Fullstack & Blockchain Engineer
            </h2>
          </MotionDiv>

          <MotionP
            className="max-w-[600px] mx-auto text-lg text-muted-foreground mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Using a fallback for now until we add the key to messages */}
            {t.has("hero_description") 
              ? t("hero_description") 
              : "Building scalable decentralized applications and modern web experiences."}
          </MotionP>

          <MotionDiv
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "h-11 px-8"
            )}>
              View Work
            </button>
            <button className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "h-11 px-8"
            )}>
              Contact Me
            </button>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
};

