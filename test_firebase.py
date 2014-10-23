from firebase import firebase
firebase = firebase.FirebaseApplication('https://goldenhour.firebaseio.com', None)
result = firebase.get('/author', None)
print result


from firebase import firebase
firebase = firebase.FirebaseApplication('https://goldenhour.firebaseio.com', None)
new_user = 'Ozgur Vatansever'
result = firebase.post('/', new_user, {'print': 'pretty'}, {'X_FANCY_HEADER': 'VERY FANCY'})
print result