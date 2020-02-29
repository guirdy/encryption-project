let inputFile = document.querySelector('#btnFile');

function getFile() {
    inputFile.click();
}

function showFile(arquivo) {
    let list = document.querySelector('.fileList');

    list.innerHTML = '<p>File: ' + event.target.files[0].name + '</p>';
    list.style.color = '#00e600';

    let buttonsCrypt = document.querySelector('.btn');
    buttonsCrypt.style.display = 'inline-block';

    let file = arquivo.files[0];
    console.log(file);
}

function data() {
    let footer = document.querySelector('#footer');
    let year = new Date().getFullYear();
    footer.innerHTML = '<p>Copyright &copy ' + year + ' - Cryptography | Todos os direitos reservados.</p>';
}

