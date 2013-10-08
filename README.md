Spruce
======

Entity User:
Every person that uses the mobile application is either a guest or a registered 
user. The specialization User has its own private key called userId and groups two 
entities called Guest and Registered User. Guest and Registered User have their 
own private key and inherit the User private key. A registered user is composed of 
a name (that consists of a first name and a last name), username, and rating.
Relationship User Has Cart:
Every user, including guest, has their own cart. For every user there is only one 
cart. Each relationship has total participation.
Entity Cart:
The cart is identified with one private key called cartId. This entity will link your 
items with the credit card to make the transaction.
Relationship Cart Contains Items:
One cart may contain multiple items and one item can be contained by multiple 
carts.
Relationship Credit Card Pays for Cart:
If a user decides to buy one or more items, the items in the cart will be paid with
one credit cart. 
Entity Credit Card:
The entity credit card has information for one credit card that contains credit card
number, expiration date (with month and year), security code, name placeholder, 
and credit type.
Relationship Credit Card Bills to Billing Address:
For every credit card there is one billing address and vice versa. The relationship 
between these has total participation.
Entity Billing Address:
Contains information of a billing address for a given user.
Relationship Credit Card Handles Invoice:
When you buy one or more item with a credit card it will generate an invoice that 
will contain information about the purchase. This will include items and their 
seller. For every invoice there must be a credit card linked to it and vice versa.
Entity Invoice:
This entity will behave like a receipt for each purchase. It will contain information 
of the items bought with their price and seller (Registered User id). The total price 
of the purchase will be a derived attribute from all the prices of the items.
Relationship Invoice receives Account:
This relationship will attach each invoice to an account of a registered user. One 
account can have zero or multiple invoices. An invoice participates in total 
participation with an account.
Entity Account:
An account is composed of the email, password, photo, and phone number of a 
registered user.
Relationship Account billed Credit Card:
For every account there can be multiple credit card attached to it, but one credit 
card has only one account. Both relationship are total participation.
Relationship Account Ships to Shipping Address:
For every account there can be multiple shipping address linked to it, but one 
shipping address can only be attached to one account.
Entity Shipping Address:
Contains information of a shipping address for a given user.
Relationship Account Links Registered User:
One registered user has only one account and vice versa. Both have total 
participation. 
Relationship Registered User sells Items:
A user can sell multiple items, but all items are sold by only one registered user.
Entity Items:
An item has a name, price (Buy it now) and the starting date of the item in store.
A user can specify the amount of items it has to sell. The user can also specify if it 
will restock the item, meaning that the user can add instantly more items. Also, it 
will have other attributes like description, model, photo, brand, and views.
Relationship Item describe Category:
An item participates in total participation for one category but a category can
describe multiple items.
Entity Category:
A category has only its private key and the name of the category.
Relationship Category Subcategory:
A category can have multiple sub categories, but a subcategory can only have one
category. 
Relationship Item participates Bid Event:
An item participates in one bid event and vice versa. Both entities participate in 
total participation.
Entity Bid Event:
A bid event will store the current bid price of the auction. It will have the ending 
date of the bid event.
Relationship Bid Event on Bid:
Multiple bids can correspond to a single bid event and participates in total 
participation with the bid event.
Entity Bid:
A bid is composed of a bid price and the date it was placed on a bid event.
Relationship Registered user places Bid:
A registered user can place multiple bids but a bid participates in total 
participation with registered user.
Relationship Bid Event determines Winning Bid:
A bid event can determine a winning bid (if there is one). A winning bid 
participates in total participation with the bid event.  
Entity Winning Bid:
The winning bid takes the price of the bid that won the bid event of an item. It will 
also contain the id of the registered user that placed the winning bid.
Relationship Winning bid pays bid Credit Card:
A winning bid can be paid by one credit card but it doesn’t participate in total 
participation because the seller can denied the winning bid. 
