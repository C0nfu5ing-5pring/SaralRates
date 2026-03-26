# Saral Rates

Saral Rates is a website for traders and farmers to check prices of different commodities published by the Indian Government daily.

# Features

- So, when you first visit the website, you will be shown all the features of it in brief
- Then you will be shown the dashboard which consists of the header, footer, sidebar and the main region where all the cards and details are displayed
- The sidebar inclues home, favourites, increase, latest favourites (for larger screens only) and decrease
- Home is for seeing all the cards at once obv.
- When you click on favourites, you will see all the bookmarked cards. Max limit is 5 days, so you can see bookmars of up to 4-5 days
- Then comes the increase section where you can see all the commodities whose prices has increase as compared to a day before
- With same but opposite functionality is the decreased section
- Now on to the header, it consists of logo, theme toggle button and search bar
- You can toggle between two themes - Black and White
- In the search bar you can search any commodity you want, this also works on increase and decrease section
- The footer is not explicitly present on the larger screens but it is shown in the sidebar itself with all the necessary details like the data source, last updated date, version, status of the site, etc.
- Cards include the following things: Commodity name, Variety (not shown if variety is same as commodity name), common price, graphical representation of the commodity's price of at least 4-5 days, the market and district from which the commodity came
- You can also compare two prices, I mean cards by right click on both of them on larger screen devices and if you are on a mobile phone or a devices that responds to touch then just hold onto a card for some time and it'll get selected then again hold onto another card to select the second card
- Comparision will be done on the basis of common price and last 7 days of prices
- Also, you can click on the data.gov.in text to see where I get the data from
- The current version doesn't have caching as localStorage can't fit this much big data. I'll figure something out later

# Functionality

- My app sends request to government api which is, [this](https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi)
- Like it pings the api everyday at a certain time (this is done manually obv) then checks whether new data is available or not, if the data is updated or new it only fetches that day
- It fetches and stores it in the database (I am using MongoDB).
- This thing will hopefully repeat up to 100-120 days
- After that time period, all the old data will be deleted (I have to do this because I am using free tier of MongoDB Cluster and also keeping such old prices doesn't make any sense)
- And now the frontend fetches the data from the backend and displayes it
- Currently on every reload, fetch is performed (which is a shame ik). I'll get into it later

# Source

- data.gov.in (Government of India)
- Actual prices may change due to market conditions IRL

# Technologies used

- Reactjs
- TailwindCSS
- Javascript
- MongoDB Compass
- mongoose
- motion.dev
- floating-ui
- react-router-dom
- react-virtuoso
- react-spinners
- html2canvas
- react-toastify
- lucide-react

# Current Status

- Version 0.7.1-beta
- Stage: Beta

# Built by

- [Shish Frutwala](https://www.C0nfu5ing-5pring.github.io/Shish/)
