import re

with open('src/components/react/TeamCarousel.tsx', 'r') as f:
    content = f.read()

# 1. TeamSilhouettes
content = re.sub(
r"""function TeamSilhouettes\(\{ team \}: \{ team: TeamData \}\) \{
  const isTrio = team\.silhouettesBlue\.length === 3;
  const isMultiple = team\.silhouettesBlue\.length > 1;
  const isPair = isMultiple && !isTrio;
  const marginClass = isPair \? "-mr-48" : isMultiple \? "-mr-40" : "-mr-16";

  return \(
    <div className="flex items-end justify-start">
      \{getSilhouetteAdjustments\(team\)\.map\(
        \(\{ sil, scaleMultiplier, translateX \}\) => \(
          <img
            key=\{sil\.alt\}
            src=\{silhouetteSrc\(sil\)\}
            alt=\{sil\.alt\}
            style=\{\{
              height: `\$\{sil\.heightDesktop \* scaleMultiplier\}px`,
              transform: `translateX\(\$\{translateX\}px\)`,
            \}\}
            className=\{`relative z-10 \$\{marginClass\} w-auto object-contain last:mr-0`\}
          />
        \),
      \)\}
    </div>
  \);
\}""",
r"""function TeamSilhouettes({ team }: { team: TeamData }) {
  const isTrio = team.silhouettesBlue.length === 3;
  const isMultiple = team.silhouettesBlue.length > 1;
  const isPair = isMultiple && !isTrio;

  const marginVw = isPair ? -10 : isMultiple ? -8.333 : -3.333;
  const adjustments = getSilhouetteAdjustments(team);

  return (
    <div className="flex items-end justify-start">
      {adjustments.map(({ sil, scaleMultiplier, translateX }, index) => {
        const isLast = index === adjustments.length - 1;
        return (
          <img
            key={sil.alt}
            src={silhouetteSrc(sil)}
            alt={sil.alt}
            style={{
              height: `${(sil.heightDesktop * scaleMultiplier / 19.2).toFixed(3)}vw`,
              transform: `translateX(${(translateX / 19.2).toFixed(3)}vw)`,
              marginRight: isLast ? 0 : `${marginVw}vw`,
            }}
            className="relative z-10 w-auto object-contain"
          />
        );
      })}
    </div>
  );
}""", content)

# 2. ArchedTeamName
content = content.replace(
    'className="h-[105px] w-[min(70vw,600px)] lg:h-[160px] lg:w-[780px]"',
    'className="h-[105px] w-[min(70vw,600px)] lg:h-[8.33vw] lg:w-[40.625vw]"'
)

# 3. MobileDescription
content = content.replace(
    '<p className="text-[0.95rem] leading-[1.2] md:text-[1.15rem]">',
    '<p className="text-[clamp(0px,3.78vw,18.4px)] leading-[1.2] md:text-[2.4vw]">'
)

# 4. DesktopDescription
content = content.replace(
    '<p className="text-2xl leading-relaxed">{team.description}</p>',
    '<p className="text-[1.35vw] leading-relaxed">{team.description}</p>'
)

# 5. Wrapper
content = content.replace(
    '<div className="relative mt-8 flex min-h-[620px] w-full flex-col items-center overflow-hidden pt-6 pb-8 md:mt-4 md:min-h-[750px] md:pt-2 lg:mt-12 lg:min-h-[1150px] lg:pt-12 lg:pb-48">',
    '<div className="relative mt-[clamp(0px,7.96vw,32px)] flex min-h-[clamp(0px,154.23vw,750px)] w-full flex-col items-center overflow-hidden pt-[clamp(0px,5.97vw,24px)] pb-[clamp(0px,7.96vw,32px)] md:mt-[2.08vw] md:min-h-[97.66vw] md:pt-[1.04vw] md:pb-[4.17vw] lg:mt-[2.5vw] lg:min-h-[59.9vw] lg:pt-[2.5vw] lg:pb-[10vw]">'
)

# 6. Nav Container
content = content.replace(
    '<div className="p3d-container relative z-10 my-2 flex w-full items-center justify-between md:my-1 lg:mt-4 lg:mb-250">',
    '<div className="p3d-container relative z-10 my-[clamp(0px,1.99vw,8px)] flex w-full items-center justify-between md:my-[0.52vw] lg:mt-[0.83vw] lg:mb-[52.08vw]">'
)

# 7. Prev Button
content = content.replace(
    'className="group inline-flex cursor-pointer items-center gap-2 bg-transparent transition-all duration-300 hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3"',
    'className="group inline-flex cursor-pointer items-center gap-[clamp(0px,1.99vw,12px)] bg-transparent transition-all duration-300 hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-[1.56vw] lg:gap-[0.625vw]"'
).replace(
    '<div className="text-secondary h-8 w-8 rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-12 sm:w-12">',
    '<div className="text-secondary h-[clamp(0px,7.96vw,48px)] w-[clamp(0px,7.96vw,48px)] rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-[6.25vw] sm:w-[6.25vw] lg:h-[2.5vw] lg:w-[2.5vw]">'
).replace(
    'className="font-noto-sans text-secondary inline-block text-base font-bold sm:text-2xl"',
    'className="font-noto-sans text-secondary inline-block text-[clamp(0px,3.98vw,24px)] font-bold sm:text-[3.13vw] lg:text-[1.25vw]"'
)

# 8. Next Button (the text was already replaced by the one above because it matches)
content = content.replace(
    'className="group inline-flex cursor-pointer items-center gap-2 bg-transparent transition-all duration-300 hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3"',
    'className="group inline-flex cursor-pointer items-center gap-[clamp(0px,1.99vw,12px)] bg-transparent transition-all duration-300 hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-[1.56vw] lg:gap-[0.625vw]"'
).replace(
    '<div className="text-secondary h-8 w-8 -rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-12 sm:w-12">',
    '<div className="text-secondary h-[clamp(0px,7.96vw,48px)] w-[clamp(0px,7.96vw,48px)] -rotate-90 transition-transform duration-300 group-hover:scale-115 sm:h-[6.25vw] sm:w-[6.25vw] lg:h-[2.5vw] lg:w-[2.5vw]">'
)

# 9. Mobile Title
content = content.replace(
    '<div className="pointer-events-none relative z-10 mt-4 mb-2 flex w-full justify-center md:mt-5 md:mb-4 lg:hidden">',
    '<div className="pointer-events-none relative z-10 mt-[clamp(0px,3.98vw,20px)] mb-[clamp(0px,1.99vw,16px)] flex w-full justify-center md:mt-[2.6vw] md:mb-[2.08vw] lg:hidden">'
)

# 10. Cog
content = content.replace(
    '<div className="absolute -bottom-[960px] left-1/2 mb-8 h-[1400px] w-[1400px] -translate-x-1/2 md:-bottom-[1700px] md:h-[2450px] md:w-[2450px] lg:top-[157%] lg:right-0 lg:h-[4150px] lg:w-[4150px] lg:translate-x-[-34%] lg:-translate-y-1/2">',
    '<div className="absolute -bottom-[clamp(0px,238.81vw,1700px)] left-1/2 mb-[clamp(0px,7.96vw,32px)] h-[clamp(0px,348.26vw,2450px)] w-[clamp(0px,348.26vw,2450px)] -translate-x-1/2 md:-bottom-[221.35vw] md:mb-[4.17vw] md:h-[319.01vw] md:w-[319.01vw] lg:top-[157%] lg:right-0 lg:mb-[1.67vw] lg:h-[216.15vw] lg:w-[216.15vw] lg:translate-x-[-34%] lg:-translate-y-1/2">'
)

with open('src/components/react/TeamCarousel.tsx', 'w') as f:
    f.write(content)

print("Done replacing.")
