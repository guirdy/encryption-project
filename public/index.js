let inputFile = document.querySelector('#btnFile');

function getFile() {
    inputFile.click();
}

function showFile() {
    let list = document.querySelector('.fileList');
    list.innerHTML = '<p>File: ' + event.target.files[0].name + '</p>';
    list.style.color = '#00e600';

    let teste = document.querySelector('.btn');
    teste.style.display = 'inline-block';
}

function data() {
    let footer = document.querySelector('#footer');
    let year = new Date().getFullYear();
    footer.innerHTML = '<p>Copyright &copy ' + year + ' - Cryptography | Todos os direitos reservados.</p>';
}

