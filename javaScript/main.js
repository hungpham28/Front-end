    // var coursesApi = 'http://localhost:3000/courses'

    // function start() {
    //   getCourses(renderCourses)
    //   handleCreateForm()
    // }
    
    // start()
    
    // function getCourses(callback) {
    //   fetch(coursesApi)
    //     .then(function(response) {
    //       return response.json()
    //     })
    //     .then(()=>{
    //       callback(no)
    //     })
    // }
    
    // function createCourses(data) {
    //   var options = {
    //     method: 'POST', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   }
    //   fetch(coursesApi, options)
    //     .then(function(response) {
    //       return response.json()
    //     })
    //     .then(function() {
    //       getCourses(renderCourses)
    //     })
    // }
    
    // function handleCreateForm() {
    //   var createBtn = document.querySelector('#create')
    //   createBtn.onclick = function() {
    //     var name = document.querySelector('input[name="name"]').value
    //     var description = document.querySelector('input[name="description"]').value
    //     var formData = {
    //       name: name,
    //       description: description
    //     }
    
    //     createCourses(formData)
    
    //   }
    // }
    
    // function handleDeleteCourses(id) {
    //   var options = {
    //     method: 'DELETE', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    //   fetch(coursesApi + '/' + id, options)
    //     .then(function(response) {
    //       return response.json()
    //     })
    //     .then(function() {
    //       var liElement = document.querySelector('.courses-item-' + id)
    //       if (liElement) {
    //         return liElement.remove()
    //       }
    //     })
    // }
    
    // function handleUpdateCourses(id) {
    //   var name = document.querySelector('input[name="name"]').value
    //   var description = document.querySelector('input[name="description"]').value
    //   var editData = {
    //     name: name,
    //     description: description
    //   }
    
    //   var options = {
    //     method: 'PUT', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(editData),
    //   }
    //   fetch(coursesApi + '/' + id, options)
    //     .then(function(response) {
    //       return response.json()
    //     })
    //     .then(function() {
    //       getCourses(renderCourses)
    //     })
    // }
    
    // function renderCourses(courses) {
    //   var listCourses = document.querySelector('#list-courses')
    //   var htmls = courses.map(function(course) {
    //     return `
    //             <li class="courses-item-${course.id}">
    //                 <h3>${course.name}</h3>
    //                 <p>${course.description}</p>
    //                 <button onclick="handleDeleteCourses(${course.id})">Delete</button>
    //                 <button onclick="handleUpdateCourses(${course.id})">Edit</button>
    //             </li>
    //         `
    //   })
    //   var html = htmls.join('')
    //   listCourses.innerHTML = html
    // }
var coursesApi="http://localhost:3000/courses"
function start(){
  getCourses(renderCourses)
  getFormCreateCoure();
}

start();

function getCourses(callback){
  fetch(coursesApi)
    .then(response =>response.json())
    .then(callback)
}

function getFormCreateCoure(){
  let btnCreate=document.querySelector('#create')
  btnCreate.onclick=function(){
    let nameCourseCreated=document.querySelector('input[name="name"]').value
    let descriptionCourseCreated=document.querySelector('input[name="description"]').value
    handleCreateCourse( { name:nameCourseCreated,  description:descriptionCourseCreated })
  }
}

function handleCreateCourse(CoureNew){
  let option ={
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(CoureNew),
  }
  fetch(coursesApi,option)
    .then(response => response.json())
    .then(()=> getCourses(renderCourses))
}

function handleDeleteCourse(id){
  let option ={
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  fetch(coursesApi+'/'+id,option)
  let courseDeleted=document.querySelector('.course-'+id)
  if (courseDeleted){
    courseDeleted.remove()
  }
}

function handleUpdateCourse(id){
  let courseUpdated={
    name:document.querySelector('input[name="name"]').value,
    description:document.querySelector('input[name="description"]').value,
  }
  let option ={
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseUpdated),
  }

  fetch(coursesApi+'/'+id,option)
    .then(response => response.json())
    .then(courseUpdateFromApi => {

      let courseUpdatedtoHtml=document.createElement('li')
      courseUpdatedtoHtml.className=`course-${courseUpdateFromApi.id}`
      courseUpdatedtoHtml.innerHTML=
      `<h2>${courseUpdateFromApi.name}</h2>
      <p>${courseUpdateFromApi.description}</p>
      <button onclick="handleDeleteCourse(${courseUpdateFromApi.id})">Delete</button>
      <button onclick="handleUpdateCourse(${courseUpdateFromApi.id})">Change</button>
      </li>`
      document.querySelector('#list-courses').replaceChild(courseUpdatedtoHtml,document.querySelector('.course-'+id))
    })


}


function renderCourses(courses){
  let listCourses=document.querySelector('#list-courses')
  let toHtml=courses.map(function(course){
    return ` <li class="course-${course.id}">
    <h2>${course.name}</h2>
    <p>${course.description}</p>
    <button onclick="handleDeleteCourse(${course.id})">Delete</button>
    <button onclick="handleUpdateCourse(${course.id})">Change</button>
    </li> `
  })
  listCourses.innerHTML=toHtml.join('')
}