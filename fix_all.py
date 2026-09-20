import re

# --- 1. Fix about.astro ---
with open('src/pages/about.astro', 'r') as f:
    about = f.read()

# Remove box-shadow
about = about.replace(
    'class="relative z-10 w-full scroll-mt-16 overflow-hidden bg-[#000024] pt-10 pb-0 sm:pt-12"\n      style="box-shadow: 100vmax 0 0 0 #000024, -100vmax 0 0 0 #000024;"',
    'class="relative z-10 w-full scroll-mt-16 overflow-hidden bg-[#000024] pt-10 pb-0 sm:pt-12"'
)

# Glass Oval (Pure VW for base and sm, remove style)
about = re.sub(
    r'<div\s+class="pointer-events-none absolute left-1/2 -z-10 block [^"]+"[^>]*>',
    '<div\n            class="pointer-events-none absolute left-1/2 -z-10 block max-w-none -translate-x-1/2 overflow-hidden rounded-[50%] bg-[#79CEFF] select-none lg:hidden h-[213.93vw] w-[318.41vw] -top-[111.94vw] sm:h-[122.4vw] sm:w-[195.31vw] sm:-top-[58.6vw]"\n            aria-hidden="true"\n          >',
    about
)

# Arrow Text (Pure VW)
about = re.sub(
    r'class="font-noto-sans order-1 text-\[[^\]]+\] leading-tight font-extrabold text-\[\#000024\] sm:text-2xl lg:order-2 lg:w-\[229px\] lg:text-\[35\.2px\]"',
    'class="font-noto-sans order-1 leading-tight font-extrabold text-[#000024] lg:order-2 text-[6.47vw] sm:text-[3.13vw] xl:text-[1.83vw] xl:w-[11.93vw]"',
    about
)

# Arrow Icon (Pure VW)
about = re.sub(
    r'<ArrowIcon className="h-\[[^\]]+\] w-auto sm:h-\[70px\] lg:h-\[167px\]" />',
    '<ArrowIcon className="w-auto h-[16.92vw] sm:h-[9.11vw] xl:h-[8.7vw]" />',
    about
)

with open('src/pages/about.astro', 'w') as f:
    f.write(about)

# --- 2. Fix TeamCarousel.tsx ---
with open('src/components/react/TeamCarousel.tsx', 'r') as f:
    carousel = f.read()

# Change all lg: to xl: (except those inside svg tags if any, but let's just do a blanket replace for tailwind classes)
# We can do this with regex finding `lg:` and replacing with `xl:`
carousel = carousel.replace('lg:', 'xl:')

# Increase Desktop Text
carousel = carousel.replace('text-[1.35vw]', 'text-[1.45vw]')

# Unclamp all the values! We replace `clamp(0px,Xvw,Ypx)` with `Xvw`
# regex: clamp\(0px,([0-9.]+vw),[0-9]+px\)
carousel = re.sub(r'clamp\(0px,([0-9.]+vw),[0-9]+px\)', r'\1', carousel)

with open('src/components/react/TeamCarousel.tsx', 'w') as f:
    f.write(carousel)

print("Done python script")
