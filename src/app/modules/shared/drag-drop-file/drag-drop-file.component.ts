import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drag-drop-file',
  templateUrl: './drag-drop-file.component.html',
  styleUrls: ['./drag-drop-file.component.scss']
})
export class DragDropFileComponent implements OnInit {

  fileStore = [];

  constructor() { }

  ngOnInit(): void {
    this.setDragAndDrop();
  }

  setDragAndDrop() {
    let dndContainer = document.getElementById('dndContainer');

    dndContainer.ondragover = function () {
      dndContainer.className = "hover"; return false;
    };

    var ondragend = function () {
      dndContainer.className = ""; return false;
    };

    dndContainer.ondrop = function (e: any) {
      this.className = "normal";
      this.fileStore.push.apply(this.fileStore, e.dataTransfer.files);
      e.preventDefault();
      e.stopPropagation();
      ondragend();
    }.bind(this);
  }

  onFilesAdded(files: FileList) {
    this.fileStore.push.apply(this.fileStore, files);
  }

  removeDroppedFile(index) {
    var delConfirm = confirm("Press OK to delete the file.");
    if (delConfirm) {
      this.fileStore.splice(index, 1);
    }
  }

}
