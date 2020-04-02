let inputFile = document.querySelector('#btnFile');
let buttonsCrypt = document.querySelector('.btn');

function getFile() {
    inputFile.click();
}

function showFile(arquivo) {
    let list = document.querySelector('.fileList');

    if(arquivo.files[0].type == 'text/plain') {
        list.innerHTML = '<p>File: ' + event.target.files[0].name + '</p>';
        list.style.color = '#00e600';

        buttonsCrypt.style.display = 'inline-block';

        let file = arquivo.files[0];
    } else {
        list.innerHTML = '<p>This is not a TXT file</p>';
        list.style.color = '#ff0000';

        buttonsCrypt.style.display = 'none';
    }
}

function data() {
    let footer = document.querySelector('#footer');
    let year = new Date().getFullYear();
    footer.innerHTML = '<p>Copyright &copy ' + year + ' - Cryptography | Todos os direitos reservados.</p>';
}

