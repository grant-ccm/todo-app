This todo app allows a user to perform basic CRUD operations on persistent todo data.
It functions by retrieving all the todos when it is first mounted. From there, the user can do the following:

SORT: A user can sort the results by clicking on the title header. By default, the items are not sorted, they just display as they are returned from the API. Clicking once gives us the up arrow which shows the results in ascending alphabetical order (all strings are converted to lowercase, so case does not matter). Clicking again gives us the down arrow which sorts them in descending alphabetical order.

FILTER: Above the table there are two filtering options. You can select a radio button to filter the items by status (defaults to all, otherwise choose complete or incomplete). You can also search by text in the todo's title. This will filter out any results that do not contain the substring you type (case does not matter).

ADD A POST: You can click the add button below the table to add a new todo item. This creates a row at the bottom with an input field to enter the title (the complete field will by default be incomplete... I don't think it makes sense to add an already completed todo but this could be easily added if needed). Once you type your todo, you can click the check mark to save the todo (or the x mark to cancel the operation).

UPDATE A POST: If you want to mark a todo as completed, you can hit the pen icon in the actions column and select the appropriate radio button. Then you can hit the check to save (or the x to cancel the action).

DELETE A POST: By hitting the trash can icon, you can delete the appropriate todo item.

What would I change: I'd like to improve the UI/UX of the list. I think it would make more sense to just be able to click a todo rather than going through the edit and save steps. I'd also like to consider error handling and some sort of loading mechanism while the requests are being made. I think it would also be better to refactor my code since I did the majority of things in one component.
