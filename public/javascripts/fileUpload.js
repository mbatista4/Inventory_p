function ready() {
    const coverWidth = 200;
    const coverAspectRation = 0.75;
    const coverHeight = coverWidth / coverAspectRation;
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    );

    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRation,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    });

    console.error('here');
    FilePond.parse(document.body);
}

ready();