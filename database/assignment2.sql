INSERT INTO public.account (
    account_firstname,
    account_last_name
    account_email,
    account_password,
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
)

--Tony Stark Update
UPDATE public.account SET account_type = 'Admin' 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Delete Tony Stark
DELETE FROM public.account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Description Update
UPDATE "inventory"
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer' AND inv_description LIKE '%small interiors%';

--Inner joins
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;


--Update Image and Thumbnail
UPDATE public.inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
