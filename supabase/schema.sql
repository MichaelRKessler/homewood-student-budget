-- Homewood on a Budget
-- Run this in the Supabase SQL editor (or via the CLI) to create the spots table.
-- Public read access only — no JHED / university SSO, no writes from the anon key.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'price_range') then
    create type public.price_range as enum ('$', '$$', '$$$');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'spot_category') then
    create type public.spot_category as enum (
      'cheap-eats',
      'student-discounts',
      'late-night',
      'coffee-study'
    );
  end if;
end
$$;

create table if not exists public.spots (
  id text primary key,
  slug text unique not null,
  name text not null,
  categories public.spot_category[] not null,
  price_range public.price_range not null,
  tip text not null,
  walking_minutes integer not null check (walking_minutes > 0),
  hours_note text not null,
  address text not null,
  neighborhood text not null,
  description text not null,
  website text,
  student_deal text,
  created_at timestamptz not null default now()
);

create index if not exists spots_neighborhood_idx on public.spots (neighborhood);
create index if not exists spots_walking_minutes_idx on public.spots (walking_minutes);

alter table public.spots enable row level security;

drop policy if exists "spots are publicly readable" on public.spots;
create policy "spots are publicly readable"
  on public.spots
  for select
  to anon, authenticated
  using (true);

-- Seed data (idempotent). Hours are approximate — always confirm before you go.
insert into public.spots (
  id, slug, name, categories, price_range, tip, walking_minutes,
  hours_note, address, neighborhood, description, website, student_deal
) values
  (
    'chipotle-st-paul',
    'chipotle',
    'Chipotle',
    array['cheap-eats', 'student-discounts', 'late-night']::public.spot_category[],
    '$',
    'A burrito bowl with extra rice and beans is the classic Homewood stretch-a-dollar move.',
    6,
    'Daily ~10:45am–10pm. Kitchen can slow down right at close — order ahead on the app.',
    '3201 Saint Paul St, Baltimore, MD 21218',
    'Charles Village',
    'The St. Paul Street Chipotle sits a block south of campus and is the default cheap dinner for half the dorms. Rewards points matter more here than any unofficial student discount. Bowls travel well back to the library.',
    'https://locations.chipotle.com/md/baltimore/3201-saint-paul-st',
    'Chipotle Rewards is the real deal — stack points instead of waiting for a mythical J-Card discount.'
  ),
  (
    'honeygrow-charles-village',
    'honeygrow',
    'honeygrow',
    array['cheap-eats', 'late-night']::public.spot_category[],
    '$$',
    'Build a smaller stir-fry and skip the honeybar if you want to stay closer to $.',
    6,
    'Daily ~10:30am–10pm.',
    '3212 St Paul St, Baltimore, MD 21218',
    'Charles Village',
    'Cooked-to-order stir-fry, salads, and a dessert bar directly across from Chipotle. A step up from fast food, still fast enough between classes. Good vegetarian default when Tamber''s is packed.',
    'https://www.honeygrow.com/location/charles-village/',
    null
  ),
  (
    'thb-bagelry',
    'thb-bagelry',
    'THB Bagelry & Deli',
    array['cheap-eats', 'coffee-study']::public.spot_category[],
    '$',
    'Go before 9am on weekdays. The line after 10:30 is a Charles Village rite of passage.',
    6,
    'Weekdays ~6am–3pm; weekends ~7am–3pm. Breakfast-and-lunch only.',
    '3208 St Paul St, Baltimore, MD 21218',
    'Charles Village',
    'Towson Hot Bagels'' Charles Village shop is the neighborhood''s morning engine: egg sandwiches, everything bagels, and coffee that actually gets you to an 8:30. Not a laptop cafe — grab and go, or squeeze into a small table.',
    'https://www.eatthb.com/locations',
    null
  ),
  (
    'tambers',
    'tambers',
    'Tamber''s',
    array['cheap-eats', 'late-night']::public.spot_category[],
    '$$',
    'Indian plates and diner classics live on the same menu. Vegetarian students eat well here.',
    8,
    'Mon–Sat ~11am–10pm; Sun ~9am–10pm. Weekend brunch until mid-afternoon.',
    '3327 St Paul St, Baltimore, MD 21218',
    'Charles Village',
    'A Charles Village fixture since the 1990s: chicken tikka, biryani, and American diner plates under one roof. It looks like a corner diner because it is one. Portions are the point. Open later than most sit-down spots on St. Paul.',
    'https://www.tambersrestaurant.com/',
    null
  ),
  (
    'one-world-cafe',
    'one-world-cafe',
    'One World Cafe',
    array['cheap-eats', 'coffee-study']::public.spot_category[],
    '$$',
    'Vegetarian and vegan comfort food plus a full bar. Chili and the veggie plates are the student order.',
    10,
    'Closed Mon–Tue. Wed–Fri ~10am–8pm; Sat ~9am–8pm; Sun ~9am–4pm. Confirm before you walk.',
    '100 W University Pkwy, Baltimore, MD 21210',
    'Charles Village',
    'A long-running vegetarian cafe on University Parkway, just north of Homewood. More restaurant than coffee counter, with a patio that fills on warm weekends. A reliable break from the St. Paul Street chains.',
    null,
    null
  ),
  (
    'bird-in-hand',
    'bird-in-hand',
    'Bird in Hand',
    array['coffee-study']::public.spot_category[],
    '$$',
    'Cafe plus bookstore. Best laptop table on the 33rd Street side of campus if you can claim one.',
    6,
    'Sun–Tue ~8am–4pm; Wed–Sat ~8am–8pm. Evening hours can shift for events.',
    '11 E 33rd St, Baltimore, MD 21218',
    'Charles Village',
    'A collaboration between Artifact Coffee and The Ivy Bookshop, Bird in Hand is the Homewood study-cafe default: espresso, pastries, books, and enough outlets to start a rumor. Midday it fills with undergrads. Evenings (when open) are quieter.',
    'https://www.birdinhandcafe.com/',
    null
  ),
  (
    'niwana',
    'niwana',
    'Niwana',
    array['cheap-eats']::public.spot_category[],
    '$$',
    'Sushi rolls and Korean plates. Dolsot bibimbap is the better value than a long sushi order.',
    6,
    'Dinner-leaning hours; typically open into the evening. Call ahead for lunch.',
    '3 E 33rd St, Baltimore, MD 21218',
    'Charles Village',
    'Charles Village''s long-standing sushi and Korean restaurant, right on 33rd Street by campus. Not the cheapest bite on the block, but it is a real sit-down option without leaving the neighborhood. Sake and a full bar if someone else is paying.',
    null,
    null
  ),
  (
    'nori-hampden',
    'nori',
    'Nori',
    array['cheap-eats', 'late-night']::public.spot_category[],
    '$$',
    'Hampden sushi on The Avenue — a walk, not a mythic St. Paul storefront. Worth it for rolls and ramen.',
    22,
    'Typically Mon–Thu ~4–10pm; Fri–Sat ~noon–11pm; Sun ~noon–10pm.',
    '850 W 36th St, Baltimore, MD 21211',
    'Hampden',
    'Nori is a sushi and Korean spot on Hampden''s 36th Street — nearby, not on campus. Students often lump it in with Homewood dinner plans because The Avenue is a pleasant 20-minute walk or a short Circulator/bus hop. Stay for a roll and ramen, skip if you only have 30 minutes between sections.',
    'http://noribmore.com/',
    null
  ),
  (
    'paper-moon-diner',
    'paper-moon-diner',
    'Papermoon Diner',
    array['cheap-eats']::public.spot_category[],
    '$$',
    'The mannequin-and-toys diner everyone sends visiting friends to. It is no longer a late-night spot.',
    16,
    'Closed Mon–Tue. Wed–Thu ~8am–4pm; Fri–Sun ~8am–6pm. Daytime only now.',
    '227 W 29th St, Baltimore, MD 21211',
    'Remington',
    'Baltimore''s most photographed diner sits in Remington, a straight shot down from campus. The menu is comfort food with a vegetarian streak. Hours shrank — do not count on it after a Thursday night in the library. Go for brunch or an afternoon plate.',
    'https://papermoondiner24.com/',
    null
  ),
  (
    'r-house',
    'r-house',
    'R. House',
    array['cheap-eats', 'student-discounts', 'late-night']::public.spot_category[],
    '$$',
    'Walk the whole food hall before you commit. Stalls vary from cheap-ish to date-night.',
    16,
    'Mon–Thu ~11:30am–10pm; Fri–Sun ~11:30am–11pm. Individual stalls may close earlier.',
    '301 W 29th St, Baltimore, MD 21211',
    'Remington',
    'A converted auto-body shop turned food hall, less than a mile from Homewood. Shawarma, fried chicken, poke, and rotating chef stalls under one roof. The closest thing Homewood has to a cheap-dinner food court that is not on campus. Ask stalls about student specials — some run them, some do not.',
    'https://r.housebaltimore.com/',
    'No single hall-wide student discount. Ask the stall; a few run Hopkins nights or smaller plates.'
  ),
  (
    'red-emmas',
    'red-emmas',
    'Red Emma''s',
    array['cheap-eats', 'student-discounts', 'coffee-study']::public.spot_category[],
    '$',
    'Worker-owned bookstore cafe on Greenmount. Coffee, vegan-friendly plates, and actual tables.',
    14,
    'Cafe hours are typically daytime into early evening. Check before a late study session.',
    '3128 Greenmount Ave, Baltimore, MD 21218',
    'Waverly',
    'Red Emma''s is a radical bookstore and cafe on Greenmount, an easy walk east of campus through Waverly. Prices are set for the neighborhood, not for Charles Street. Good for laptops, soup, and not spending $16 on a salad.',
    'https://redemmas.org/',
    'No gimmick card required — the menu is already priced like a student cafe.'
  ),
  (
    'petes-grille',
    'petes-grille',
    'Pete''s Grille',
    array['cheap-eats']::public.spot_category[],
    '$',
    'Cash-friendly Waverly breakfast diner. Go hungry. The scrapple debate is local sport.',
    14,
    'Breakfast and lunch. Typically opens early and closes mid-afternoon. Closed some evenings.',
    '3130 Greenmount Ave, Baltimore, MD 21218',
    'Waverly',
    'A no-nonsense diner next to Red Emma''s. Huge breakfast plates, short-order lunch, and a line of regulars who have been coming since before you picked a major. One of the last truly cheap sit-down meals in walking distance.',
    null,
    null
  ),
  (
    'insomnia-cookies',
    'insomnia-cookies',
    'Insomnia Cookies',
    array['late-night']::public.spot_category[],
    '$',
    'Warm cookies until the small hours. Delivery is the move after 11pm.',
    6,
    'Often open into the early morning (commonly until ~2–3am). Confirm on the app.',
    '3301 N Charles St, Baltimore, MD 21218',
    'Charles Village',
    'The campus cookie shop. Not dinner. Entirely dinner if it is 1am and you are done pretending otherwise. Pickup at Charles Commons / N. Charles, plus delivery across the Homewood zip codes.',
    'https://insomniacookies.com/',
    null
  ),
  (
    'seven-eleven-charles',
    '7-eleven-charles-village',
    '7-Eleven',
    array['late-night']::public.spot_category[],
    '$',
    'The 24-hour backup when everything else is closed. Slurpee and a hot dog is a valid meal.',
    12,
    'Typically 24 hours. Some nights close briefly after midnight for cleaning.',
    '3003 N Charles St, Baltimore, MD 21218',
    'Charles Village',
    'Under the Homewood Apartments at Hopkins Square, this 7-Eleven is the last light on for a lot of students. It is not a restaurant. It is the reason you do not have to leave the neighborhood at 2am. Pair with the Charles Street late-night walk, not a date.',
    'https://www.7-eleven.com/',
    null
  ),
  (
    'carmas-cafe',
    'carmas-cafe',
    'Carma''s Cafe',
    array['cheap-eats', 'coffee-study']::public.spot_category[],
    '$',
    'The old 32nd Street shop moved on campus. Sandwiches and bakery cases, not a late-night kitchen.',
    3,
    'Breakfast and lunch on campus hours. Typically done by mid-afternoon.',
    'Steven Muller Building, Johns Hopkins Homewood Campus, Baltimore, MD 21218',
    'Homewood campus',
    'Carma''s left its longtime St. Paul storefront and now operates from the Steven Muller Building on campus. Same idea: sandwiches, coffee, and bakery items that have fueled Homewood mornings for years. Blueprint Cafe later took the old 32nd Street room.',
    null,
    'On-campus location — convenient if you are already on the quad. Confirm J-Card acceptance at the register.'
  ),
  (
    'artifact-coffee',
    'artifact-coffee',
    'Artifact Coffee',
    array['coffee-study']::public.spot_category[],
    '$$',
    'Hampden sister to Bird in Hand. Better if you want a longer table and a change of scenery.',
    25,
    'Typically daytime into early evening. Not a late-night cafe.',
    '1500 Union Ave, Baltimore, MD 21211',
    'Hampden',
    'Woodberry Kitchen''s coffee shop in a former mill building on Union Avenue. A little farther than The Avenue, but a favorite when you need to get off campus and still work. Espresso, light food, and a room that does not feel like a dining hall.',
    'https://www.artifactcoffee.com/',
    null
  ),
  (
    'holy-frijoles',
    'holy-frijoles',
    'Holy Frijoles',
    array['cheap-eats']::public.spot_category[],
    '$',
    'Hampden Tex-Mex. Combo plates and margaritas; tacos are the student-budget order.',
    22,
    'Lunch and dinner on The Avenue. Typically open into the evening; confirm late-night.',
    '908 W 36th St, Baltimore, MD 21211',
    'Hampden',
    'A 36th Street institution: casual Tex-Mex, a loud dining room, and prices that still make sense after a Circulator ride. Pair with The Charmery if you are already in Hampden. Not East Baltimore, not a chain.',
    null,
    null
  ),
  (
    'the-charmery',
    'the-charmery',
    'The Charmery',
    array['cheap-eats']::public.spot_category[],
    '$',
    'Baltimore ice cream on The Avenue. One scoop is a legitimate study break.',
    22,
    'Typically afternoon into evening. Seasonal hours — winter can close earlier.',
    '801 W 36th St, Baltimore, MD 21211',
    'Hampden',
    'Local ice cream shop on Hampden''s Avenue. Scoops, shakes, and flavors that show up in every ''things to do near Homewood'' list for a reason. Cheap if you do not turn it into a four-topping production.',
    'https://www.thecharmery.com/',
    null
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  categories = excluded.categories,
  price_range = excluded.price_range,
  tip = excluded.tip,
  walking_minutes = excluded.walking_minutes,
  hours_note = excluded.hours_note,
  address = excluded.address,
  neighborhood = excluded.neighborhood,
  description = excluded.description,
  website = excluded.website,
  student_deal = excluded.student_deal;
