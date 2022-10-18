console.log("Hola consola php.");

$(function(){
    console.log("JQuery está funcionando");
    
    let edit = false;

    $('#task-result').hide();
    fetchTareas();

    $('#search').keyup(function(e){
        if ($('#search').val()) {
            let search = $('#search').val();
            console.log(search);
            $.ajax({
                url: 'php/task-search.php',
                type: 'POST',
                data: {search},
                success: function(response) {
                    try {
                        console.log('Este es el response: ' + response);
                        let tareas = JSON.parse(response);
                        console.log('Estas son las tareas: ' + tareas);
                        let template = '';
                        if(tareas == ''){
                            template = '<p>No hay resultados</p>'
                        }
                        tareas.forEach(tarea => {
                            console.log('Estoy en el foreach' + tarea);
                            template += `<li>
                                ${tarea.name}
                            </li>`
                        });
                        $('#container').html(template);
                        $('#task-result').show();                        
                    } catch (error) {
                        console.log('error', error);
                    }
                }
            });
        }
    });

    $('#tareas-form').submit(function(e){
        const postData = {
            id: $('#taskId').val(),
            name: $('#name').val(),
            description: $('#description').val()
        };

        let url = edit === false ? 'php/task-add.php' : 'php/task-edit.php';

        $.post(url, postData, function(response){
            console.log(response);
            fetchTareas();
            $('#tareas-form').trigger('reset');
        });

        e.preventDefault();
    });

    function fetchTareas(){
        $.ajax({
            url: 'php/task-list.php',
            type: 'GET',
            success: function(response){
                console.log(response);
                let tareas = JSON.parse(response);
                let template = '';
                if(tareas == ''){
                    template = '<p>No hay resultados</p>'
                }
                tareas.forEach(tarea => {
                    console.log('Estoy en el foreach' + tarea);
                    template += `
                        <tr taskId=${tarea.id}>
                            <td>${tarea.id}</td>
                            <td>
                                <a href="#" class="task-item">${tarea.name}</a>
                            </td>
                            <td>${tarea.description}</td>
                            <td>
                                <button class="task-delete btn btn-danger">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `
                });
                $('#tabla-tareas').html(template);
            }
        });
    }

    $(document).on('click', '.task-delete', function(e){
        if(confirm('¿Estás seguro de querer eliminarlo?')){
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('php/task-delete.php', {id}, function(response) {
                console.log(response);
                fetchTareas();
            });
            e.preventDefault();
        }
    });

    $(document).on('click', '.task-item', function(){
        console.log('Editando');
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('php/task-single.php',{id}, function(response){
            console.log(response);
            let tarea = JSON.parse(response);
            $('#name').val(tarea.name);
            $('#description').val(tarea.description);
            $('#taskId').val(tarea.id);
            edit = true;
        });
    });
});

