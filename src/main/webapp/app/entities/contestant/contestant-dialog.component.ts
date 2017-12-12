import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Contestant } from './contestant.model';
import { ContestantPopupService } from './contestant-popup.service';
import { ContestantService } from './contestant.service';

@Component({
    selector: 'jhi-contestant-dialog',
    templateUrl: './contestant-dialog.component.html'
})
export class ContestantDialogComponent implements OnInit {

    contestant: Contestant;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private contestantService: ContestantService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.contestant.id !== undefined) {
            this.subscribeToSaveResponse(
                this.contestantService.update(this.contestant));
        } else {
            this.subscribeToSaveResponse(
                this.contestantService.create(this.contestant));
        }
    }

    private subscribeToSaveResponse(result: Observable<Contestant>) {
        result.subscribe((res: Contestant) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Contestant) {
        this.eventManager.broadcast({ name: 'contestantListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-contestant-popup',
    template: ''
})
export class ContestantPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private contestantPopupService: ContestantPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.contestantPopupService
                    .open(ContestantDialogComponent as Component, params['id']);
            } else {
                this.contestantPopupService
                    .open(ContestantDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
