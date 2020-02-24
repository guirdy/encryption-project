function data() {
    let footer = document.querySelector('#footer');
    let year = new Date().getFullYear();

    footer.innerHTML = '<p>Copyright &copy ' + year + ' - Cryptography | Todos os direitos reservados.</p>';
}