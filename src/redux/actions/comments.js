import { db } from "../../firebase";

export const SHOW_COMMENTS = 'SHOW_COMMENTS';
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS';

export const showComments = (comments) => ({
    type: SHOW_COMMENTS,
    payload: comments
});

export const updateComments = (comments) => ({
    type: UPDATE_COMMENTS,
    payload: comments
})

export const getComments = (id) => {
    return function (dispatch) {
        db.collection("comments")
            .where("videoID", "==", id)
            .get()
            .then((comments) => {
                let dbComments = [];
                comments.forEach((doc) => {
                    dbComments.push(doc.data());
                });
                dispatch(showComments(dbComments));
            });
    }
}

export const showUpdatedComments = (id, user, inputValue) => {
    return function (dispatch) {
        const commentData = {
            videoID: id,
            comment: inputValue,
            userID: user.uid,
            displayName: user.displayName,

        }
        db.collection('comments').doc().set(commentData)
        .then(() => {
            db.collection("comments")
                .where("videoID", "==", id)
                .get()
                .then((comments) => {
                    let dbComments = [];
                    comments.forEach((doc) => {
                        dbComments.push(doc.data());
                    });
                    dispatch(showComments(dbComments));
                    console.log(dbComments);
                });
        })
}
}