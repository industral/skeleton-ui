describe('loader', function() {
  var root,
      container;

  beforeEach(function() {
    root = document.createElement('div');
    root.className = 'root';

    container = document.createElement('div');
    container.className = 'container';
    container.style.position = 'absolute';

    root.appendChild(container);

    // as function is used offset* we need to really append it to document
    document.body.appendChild(root);
  });

  afterEach(function() {
    root.parentNode.removeChild(root);
  });

  it('should correct init', function() {
    var loader = new UI.component.Loader();

    container.style.width = '10px';
    container.style.height = '10px';

    loader.show({
      dom: container
    });

    var loaderEl = container.nextSibling;

    expect(loaderEl.classList.contains('cmp-loader')).toBeTruthy();
    expect(loaderEl.style.top).toEqual('-1px');
    expect(loaderEl.style.left).toEqual('-1px');
    expect(loaderEl.style.width).toEqual('11px');
    expect(loaderEl.style.height).toEqual('11px');
  });

  it('should correct init, width, height, top, left, !transparent', function() {
    var loader = new UI.component.Loader();

    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '20px';
    container.style.width = '200px';
    container.style.height = '100px';

    loader.show({
      dom: container
    });

    var loaderEl = container.nextSibling;

    expect(loaderEl.classList.contains('cmp-loader')).toBeTruthy();
    expect(loaderEl.style.top).toEqual('9px');
    expect(loaderEl.style.left).toEqual('19px');
    expect(loaderEl.style.width).toEqual('201px');
    expect(loaderEl.style.height).toEqual('101px');

    expect(loaderEl.style.backgroundColor).not.toEqual('transparent');
  });

  it('should be transparent', function() {
    var loader = new UI.component.Loader();

    loader.show({
      dom: container,
      transparent: true
    });

    var loaderEl = container.nextSibling;

    expect(loaderEl.style.backgroundColor).toEqual('transparent');
  });

  it('entire document loader', function() {
    var loader = new UI.component.Loader();
    loader.show();

    var loaderEl = document.getElementsByClassName('cmp-general-loader')[0];
    expect(loaderEl).not.toBeUndefined();
    expect(loaderEl.getElementsByTagName('span')[0].textContent).
        toEqual('Loading...');

    loader.hide();
  });

  it('should hide properly', function() {
    var loader = new UI.component.Loader();
    loader.show({
      dom: container
    });

    expect(document.getElementsByClassName('cmp-loader')[0]).not.
        toBeUndefined();

    loader.hide();

    expect(document.getElementsByClassName('cmp-loader')[0]).toBeUndefined();
  });

  it('should hide properly with entire document loader', function() {
    var loader = new UI.component.Loader();
    loader.show();

    expect(document.getElementsByClassName('cmp-general-loader')[0]).not.
        toBeUndefined();

    loader.hide();

    expect(document.getElementsByClassName('cmp-general-loader')[0]).
        toBeUndefined();
  });

});
