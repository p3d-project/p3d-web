import re

with open('src/pages/about.astro', 'r') as f:
    content = f.read()

# 1. Box shadow on #team
content = content.replace(
    'class="relative z-10 w-full scroll-mt-16 overflow-hidden bg-[#000024] pt-10 pb-0 sm:pt-12"\n    >',
    'class="relative z-10 w-full scroll-mt-16 overflow-hidden bg-[#000024] pt-10 pb-0 sm:pt-12"\n      style="box-shadow: 100vmax 0 0 0 #000024, -100vmax 0 0 0 #000024;"\n    >'
)

# 2. Glass Oval
content = content.replace(
    'class="pointer-events-none absolute left-1/2 -z-10 block h-[860px] w-[1280px] max-w-none -translate-x-1/2 overflow-hidden rounded-[50%] bg-[#79CEFF] select-none sm:h-[940px] sm:w-[1500px] lg:hidden"\n            style="top: -450px;"',
    'class="pointer-events-none absolute left-1/2 -z-10 block h-[clamp(0px,213.93vw,860px)] w-[clamp(0px,318.41vw,1280px)] max-w-none -translate-x-1/2 overflow-hidden rounded-[50%] bg-[#79CEFF] select-none sm:h-[940px] sm:w-[1500px] lg:hidden"\n            style="top: max(-450px, -111.94vw);"'
)

# 3. Arrow Text
content = content.replace(
    'class="font-noto-sans order-1 text-[26px] leading-tight font-extrabold text-[#000024] sm:text-2xl lg:order-2 lg:w-[229px] lg:text-[35.2px]"',
    'class="font-noto-sans order-1 text-[clamp(0px,6.47vw,26px)] leading-tight font-extrabold text-[#000024] sm:text-2xl lg:order-2 lg:w-[229px] lg:text-[35.2px]"'
)

# 4. Arrow Icon
content = content.replace(
    '<ArrowIcon className="h-[68px] w-auto sm:h-[70px] lg:h-[167px]" />',
    '<ArrowIcon className="h-[clamp(0px,16.92vw,68px)] w-auto sm:h-[70px] lg:h-[167px]" />'
)

with open('src/pages/about.astro', 'w') as f:
    f.write(content)

print("Done fixing about.astro.")
