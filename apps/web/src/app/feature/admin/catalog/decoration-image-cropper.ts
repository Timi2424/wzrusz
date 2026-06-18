import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  computeBaseScale,
  computeCropRect,
  cropImageToWebpFile,
} from './decoration-image-crop.util';

@Component({
  selector: 'app-decoration-image-cropper',
  imports: [FormsModule],
  templateUrl: './decoration-image-cropper.html',
  styleUrl: './decoration-image-cropper.scss',
})
export class DecorationImageCropperComponent implements OnDestroy {
  readonly file = input<File | null>(null);
  readonly cancel = output<void>();
  readonly cropped = output<File>();
  readonly cropFailed = output<void>();

  protected readonly imageSrc = signal<string | null>(null);
  protected readonly zoom = signal(1);
  protected readonly imageTransform = signal('translate(-50%, -50%) scale(1)');
  protected readonly imageReady = signal(false);
  protected readonly exporting = signal(false);
  protected readonly localError = signal<string | null>(null);

  private readonly frameRef = viewChild<ElementRef<HTMLElement>>('frame');

  private sourceFile: File | null = null;
  private imageWidth = 0;
  private imageHeight = 0;
  private baseScale = 1;
  private panX = 0;
  private panY = 0;
  private dragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private objectUrl: string | null = null;

  constructor() {
    effect(() => {
      const nextFile = this.file();
      if (nextFile) {
        this.loadFile(nextFile);
      }
    });
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  protected onZoomChange(value: number): void {
    this.zoom.set(value);
    this.updateTransform();
  }

  protected onPointerDown(event: PointerEvent): void {
    if (!this.imageSrc()) {
      return;
    }
    this.dragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.panStartX = this.panX;
    this.panStartY = this.panY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    this.panX = this.panStartX + (event.clientX - this.dragStartX);
    this.panY = this.panStartY + (event.clientY - this.dragStartY);
    this.updateTransform();
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    (event.currentTarget as HTMLElement).releasePointerCapture(
      event.pointerId,
    );
  }

  protected async confirmCrop(): Promise<void> {
    const file = this.sourceFile;
    const src = this.imageSrc();
    if (!file || !src || !this.imageReady()) {
      this.localError.set('Zdjęcie jeszcze się ładuje — poczekaj chwilę.');
      return;
    }

    this.exporting.set(true);
    this.localError.set(null);

    try {
      const img = await this.loadImageElement(src);
      const crop = computeCropRect(
        this.imageWidth,
        this.imageHeight,
        this.frameSize(),
        {
          baseScale: this.baseScale,
          zoom: this.zoom(),
          panX: this.panX,
          panY: this.panY,
        },
      );

      const cropped = await cropImageToWebpFile(img, crop, file.name);
      this.cropped.emit(cropped);
    } catch {
      this.localError.set('Nie udało się przygotować zdjęcia.');
      this.cropFailed.emit();
    } finally {
      this.exporting.set(false);
    }
  }

  private loadFile(file: File): void {
    this.revokeObjectUrl();
    this.sourceFile = file;
    this.imageReady.set(false);
    this.localError.set(null);
    this.zoom.set(1);
    this.panX = 0;
    this.panY = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;

    const url = URL.createObjectURL(file);
    this.objectUrl = url;
    this.imageSrc.set(url);

    const img = new Image();
    img.onload = () => {
      this.imageWidth = img.naturalWidth;
      this.imageHeight = img.naturalHeight;
      this.baseScale = computeBaseScale(
        this.imageWidth,
        this.imageHeight,
        this.frameSize(),
      );
      this.updateTransform();
      this.imageReady.set(true);
    };
    img.onerror = () => {
      this.localError.set('Nie udało się wczytać pliku.');
      this.imageReady.set(false);
    };
    img.src = url;
  }

  private frameSize(): { width: number; height: number } {
    const el = this.frameRef()?.nativeElement;
    if (!el) {
      return { width: 384, height: 288 };
    }
    return { width: el.clientWidth, height: el.clientHeight };
  }

  private updateTransform(): void {
    const scale = this.baseScale * this.zoom();
    this.imageTransform.set(
      `translate(calc(-50% + ${this.panX}px), calc(-50% + ${this.panY}px)) scale(${scale})`,
    );
  }

  private loadImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = src;
    });
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.imageSrc.set(null);
    this.sourceFile = null;
    this.imageReady.set(false);
  }
}
